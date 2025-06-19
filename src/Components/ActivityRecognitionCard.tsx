import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import ActivityRecognition, {
  ActivityRecognitionResult,
} from '../services/ActivityRecognition';
import {colors} from '../Assets/Styles';

interface ActivityRecognitionCardProps {
  onActivityChange?: (activity: ActivityRecognitionResult) => void;
  showLog?: boolean;
  maxLogItems?: number;
}

const ActivityRecognitionCard: React.FC<ActivityRecognitionCardProps> = ({
  onActivityChange,
  showLog = true,
  maxLogItems = 10,
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentActivity, setCurrentActivity] =
    useState<ActivityRecognitionResult | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityRecognitionResult[]>(
    [],
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set up activity change listener
      ActivityRecognition.addListener((result: ActivityRecognitionResult) => {
        console.log('Activity event:', result);
        setCurrentActivity(result);
        setActivityLog(prev => [result, ...prev].slice(0, maxLogItems));
        onActivityChange?.(result);
      });

      // Cleanup on unmount
      return () => {
        ActivityRecognition.removeListener();
        if (isTracking) {
          ActivityRecognition.stopActivityRecognition();
        }
      };
    }
  }, [onActivityChange, maxLogItems]);

  const toggleTracking = async () => {
    try {
      if (isTracking) {
        await ActivityRecognition.stopActivityRecognition();
      } else {
        await ActivityRecognition.startActivityRecognition();
      }
      setIsTracking(!isTracking);
    } catch (error) {
      console.error('Error toggling activity recognition:', error);
      Alert.alert(
        'Error',
        'Failed to toggle activity recognition. Please try again.',
      );
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'IN_VEHICLE':
        return '#4CAF50';
      case 'ON_FOOT':
        return '#2196F3';
      case 'WALKING':
        return '#2196F3';
      case 'RUNNING':
        return '#9C27B0';
      case 'STILL':
        return '#FF9800';
      case 'ON_BICYCLE':
        return '#00BCD4';
      case 'TILTING':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  if (Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Activity Recognition is only available on Android devices.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Recognition</Text>
        <TouchableOpacity
          style={[styles.toggleButton, isTracking && styles.toggleButtonActive]}
          onPress={toggleTracking}>
          <Text style={styles.toggleButtonText}>
            {isTracking ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>

      {currentActivity && (
        <View style={styles.currentActivity}>
          <View
            style={[
              styles.activityCard,
              {borderColor: getActivityColor(currentActivity.activity)},
            ]}>
            <Text style={styles.activityType}>{currentActivity.activity}</Text>
            <Text style={styles.confidence}>
              Confidence: {currentActivity.confidence}%
            </Text>
            <Text style={styles.timestamp}>
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}

      {showLog && (
        <View style={styles.logSection}>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          <ScrollView style={styles.logContainer}>
            {activityLog.map((activity, index) => (
              <View
                key={index}
                style={[
                  styles.logItem,
                  {borderLeftColor: getActivityColor(activity.activity)},
                ]}>
                <View>
                  <Text style={styles.logType}>{activity.activity}</Text>
                  <Text style={styles.logConfidence}>
                    Confidence: {activity.confidence}%
                  </Text>
                </View>
                <Text style={styles.logTime}>
                  {new Date().toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#F44336',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  currentActivity: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  confidence: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  logSection: {
    maxHeight: 200,
  },
  logContainer: {
    flex: 1,
  },
  logItem: {
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 6,
    borderRadius: 6,
    borderLeftWidth: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#000',
  },
  logConfidence: {
    fontSize: 12,
    color: '#666',
  },
  logTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default ActivityRecognitionCard;
