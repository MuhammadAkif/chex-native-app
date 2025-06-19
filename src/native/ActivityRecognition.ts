import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type ActivityType =
  | 'IN_VEHICLE'
  | 'ON_BICYCLE'
  | 'ON_FOOT'
  | 'RUNNING'
  | 'STILL'
  | 'TILTING'
  | 'UNKNOWN'
  | 'WALKING';

export type ActivityTransition = 'ENTER' | 'EXIT';

export interface ActivityEvent {
  type: ActivityType;
  transition: ActivityTransition;
  timestamp: number;
}

export interface ActivityRecognitionError {
  code: string;
  message: string;
}

const {ActivityRecognition} = NativeModules;
console.log({NativeModules});
if (!ActivityRecognition) {
  throw new Error('ActivityRecognition native module is not available');
}

const eventEmitter = new NativeEventEmitter(ActivityRecognition);

class ActivityRecognitionModule {
  private isTracking: boolean = false;
  private gpsWatchId: number | null = null;
  private gpsPoints: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }> = [];
  private consecutiveVehicleEvents: number = 0;
  private tripStartTime: number | null = null;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    eventEmitter.addListener('ActivityChanged', this.handleActivityChange);
    eventEmitter.addListener('ActivityRecognitionStatus', this.handleStatus);
  }

  private handleActivityChange = (event: ActivityEvent) => {
    console.log('event listener', event);
    if (event.type === 'IN_VEHICLE' && event.transition === 'ENTER') {
      this.consecutiveVehicleEvents++;
      if (this.consecutiveVehicleEvents >= 3 && !this.isTracking) {
        this.startTrip();
      }
    } else if (
      event.type === 'STILL' &&
      event.transition === 'ENTER' &&
      this.isTracking
    ) {
      this.stopTrip();
    } else {
      this.consecutiveVehicleEvents = 0;
    }
  };

  private handleStatus = (event: {status: string; error?: string}) => {
    console.log('Activity recognition status:', event);
  };

  private startTrip() {
    this.isTracking = true;
    this.tripStartTime = Date.now();
    this.startGpsTracking();
  }

  private stopTrip() {
    this.isTracking = false;
    this.stopGpsTracking();
    this.uploadTrip();
  }

  private startGpsTracking() {
    this.gpsWatchId = Geolocation.watchPosition(
      position => {
        this.gpsPoints.push({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
      },
      error => console.error('GPS error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
      },
    );
  }

  private stopGpsTracking() {
    if (this.gpsWatchId !== null) {
      Geolocation.clearWatch(this.gpsWatchId);
      this.gpsWatchId = null;
    }
  }

  private async uploadTrip() {
    if (!this.tripStartTime || this.gpsPoints.length === 0) {
      return;
    }

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: this.tripStartTime,
          endTime: Date.now(),
          polyline: this.gpsPoints,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload trip');
      }

      this.gpsPoints = [];
      this.tripStartTime = null;
    } catch (error) {
      console.error('Failed to upload trip:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return await ActivityRecognition.requestPermissions();
    }
    return true; // iOS doesn't require runtime permissions for motion
  }

  startActivityRecognition() {
    ActivityRecognition.startActivityRecognition();
  }

  stopActivityRecognition() {
    ActivityRecognition.stopActivityRecognition();
    this.stopGpsTracking();
    this.gpsPoints = [];
    this.tripStartTime = null;
    this.isTracking = false;
    this.consecutiveVehicleEvents = 0;
  }

  cleanup() {
    eventEmitter.removeAllListeners('ActivityChanged');
    eventEmitter.removeAllListeners('ActivityRecognitionStatus');
    this.stopActivityRecognition();
  }

  // Expose the event emitter for external use
  addListener(eventType: string, listener: (event: any) => void) {
    return eventEmitter.addListener(eventType, listener);
  }
}

export default new ActivityRecognitionModule();
