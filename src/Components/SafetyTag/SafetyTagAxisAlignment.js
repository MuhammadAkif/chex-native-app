import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import useAxisAlignment from '../../hooks/useAxisAlignment';

const SafetyTagAxisAlignment = () => {
  const {
    alignmentState,
    alignmentData,
    isAligning,
    error,
    startAxisAlignment,
    stopAxisAlignment,
  } = useAxisAlignment();

  const handleStartAlignment = () => {
    startAxisAlignment(false);
  };

  const handleStopAlignment = () => {
    stopAxisAlignment();
  };

  const renderAlignmentState = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alignment Status</Text>
      <Text style={styles.text}>
        Phase: {alignmentState?.phase || 'Not started'}
      </Text>
      {alignmentState?.details?.message && (
        <Text style={styles.message}>{alignmentState.details.message}</Text>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {/* Vehicle State */}
      {alignmentState?.details?.vehicleState !== undefined && (
        <View style={styles.subsection}>
          <Text
            style={[
              styles.text,
              !alignmentState.details.vehicleState && styles.warningText,
            ]}>
            Vehicle State:{' '}
            {alignmentState.details.vehicleState ? 'Valid' : 'Invalid'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderAxisDetails = () => {
    if (!alignmentState?.details) {
      return null;
    }
    const {zAxis, xAxis, angles} = alignmentState.details;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Axis Details</Text>

        {/* Z-Axis Information */}
        {zAxis && (
          <View style={styles.axisSection}>
            <Text style={styles.axisTitle}>Z-Axis</Text>
            <Text style={[styles.text, !zAxis.online && styles.warningText]}>
              Status: {zAxis.online ? 'Online' : 'Offline'}
            </Text>
            <Text style={styles.message}>{zAxis.message}</Text>
          </View>
        )}

        {/* X-Axis Information */}
        {xAxis && (
          <View style={styles.axisSection}>
            <Text style={styles.axisTitle}>X-Axis</Text>
            <Text style={styles.text}>Phase: {xAxis.phase}</Text>
            <Text style={styles.text}>Confidence: {xAxis.confidence}</Text>
            <Text style={styles.text}>Progress: {xAxis.bootstrapProgress}</Text>
            <Text style={styles.message}>{xAxis.message}</Text>
          </View>
        )}

        {/* Angle Information */}
        {angles && (
          <View style={styles.axisSection}>
            <Text style={styles.axisTitle}>Angles</Text>
            <Text style={styles.text}>Current: {angles.current}°</Text>
            <Text style={styles.text}>Previous: {angles.previous}°</Text>
          </View>
        )}

        {/* Final Alignment Values */}
        {alignmentData &&
          alignmentData.theta != null &&
          alignmentData.phi != null && (
            <View style={styles.alignmentValues}>
              <Text style={styles.axisTitle}>Final Values</Text>
              <Text style={styles.text}>
                Theta: {Number(alignmentData.theta).toFixed(2)}°
              </Text>
              <Text style={styles.text}>
                Phi: {Number(alignmentData.phi).toFixed(2)}°
              </Text>
            </View>
          )}
      </View>
    );
  };

  const renderControls = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={[
          styles.button,
          isAligning ? styles.stopButton : styles.startButton,
        ]}
        onPress={isAligning ? handleStopAlignment : handleStartAlignment}
        disabled={alignmentState?.details?.vehicleState === false}>
        <Text style={styles.buttonText}>
          {isAligning ? 'Stop Alignment' : 'Start Alignment'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Axis Alignment</Text>
      {renderAlignmentState()}
      {renderAxisDetails()}
      {renderControls()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  subsection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  axisSection: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  axisTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  message: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#f44336',
    fontWeight: '500',
  },
  warningText: {
    color: '#ff9800',
  },
  alignmentValues: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SafetyTagAxisAlignment;
