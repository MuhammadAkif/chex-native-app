import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const formatDuration = (startDate, endDate) => {
  const seconds = endDate - startDate;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

const TripItem = ({trip}) => {
  const startDate = new Date(trip.startDate * 1000); // Convert Unix timestamp to milliseconds
  const endDate = new Date(trip.endDate * 1000); // Convert Unix timestamp to milliseconds
  const duration = formatDuration(trip.startDate, trip.endDate);

  return (
    <View style={styles.tripItem}>
      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Start:</Text>
          <Text style={styles.value}>
            {startDate.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>End:</Text>
          <Text style={styles.value}>
            {endDate.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Connection:</Text>
          <Text style={[
            styles.value,
            !trip.connectedDuringTrip && styles.warningText
          ]}>
            {trip.connectedDuringTrip ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SafetyTagTrips = ({trips = [], isLoading = false, deviceName = ''}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading trips...</Text>
      </View>
    );
  }

  if (!trips.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTripsText}>No trips recorded</Text>
      </View>
    );
  }

  // Sort trips by start date (most recent first)
  const sortedTrips = [...trips].sort((a, b) => b.startDate - a.startDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recorded Trips</Text>
      {deviceName && (
        <Text style={styles.subtitle}>Device: {deviceName}</Text>
      )}
      <Text style={styles.subtitle}>Total Trips: {trips.length}</Text>
      {sortedTrips.map((trip, index) => (
        <TripItem key={index} trip={trip} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  tripItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 12,
  },
  tripDetails: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noTripsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  warningText: {
    color: '#ff9800',
  },
});

export default SafetyTagTrips;
