import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { ActivityRecognition } = NativeModules;

export interface ActivityRecognitionResult {
  activity: string;
  confidence: number;
  type: number;
}

class ActivityRecognitionService {
  private eventEmitter: NativeEventEmitter | null = null;
  private subscription: any;

  constructor() {
    if (Platform.OS === 'android') {
      this.eventEmitter = new NativeEventEmitter(ActivityRecognition);
      console.log('[ActivityRecognition] Service initialized');
    }
  }

  async checkPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.log('[ActivityRecognition] Permission check not available on this platform');
      return false;
    }
    const hasPermission = await ActivityRecognition.checkPermission();
    console.log('[ActivityRecognition] Permission check result:', hasPermission);
    return hasPermission;
  }

  async startActivityRecognition(): Promise<string> {
    if (Platform.OS !== 'android') {
      console.log('[ActivityRecognition] Not available on this platform');
      throw new Error('Activity Recognition is only available on Android');
    }

    console.log('[ActivityRecognition] Starting activity recognition...');
    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      console.log('[ActivityRecognition] Permission denied');
      throw new Error('Activity recognition permission is required');
    }

    try {
      const result = await ActivityRecognition.startActivityRecognition();
      console.log('[ActivityRecognition] Started successfully:', result);
      return result;
    } catch (error) {
      console.error('[ActivityRecognition] Failed to start:', error);
      throw error;
    }
  }

  async stopActivityRecognition(): Promise<string> {
    if (Platform.OS !== 'android') {
      console.log('[ActivityRecognition] Not available on this platform');
      throw new Error('Activity Recognition is only available on Android');
    }

    console.log('[ActivityRecognition] Stopping activity recognition...');
    try {
      const result = await ActivityRecognition.stopActivityRecognition();
      console.log('[ActivityRecognition] Stopped successfully:', result);
      return result;
    } catch (error) {
      console.error('[ActivityRecognition] Failed to stop:', error);
      throw error;
    }
  }

  addListener(callback: (result: ActivityRecognitionResult) => void) {
    if (Platform.OS !== 'android' || !this.eventEmitter) {
      console.log('[ActivityRecognition] Cannot add listener on this platform');
      return;
    }
    console.log('[ActivityRecognition] Adding activity listener');
    this.subscription = this.eventEmitter.addListener(
      'activityRecognitionUpdate',
      (result: ActivityRecognitionResult) => {
        console.log('[ActivityRecognition] Activity update:', result);
        callback(result);
      },
    );
  }

  removeListener() {
    if (this.subscription) {
      console.log('[ActivityRecognition] Removing activity listener');
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

export default new ActivityRecognitionService(); 