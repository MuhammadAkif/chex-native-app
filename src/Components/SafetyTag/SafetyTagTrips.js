import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TripItem = ({trip}) => (
  <View style={styles.tripItem}>
    <View style={styles.tripDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Device:</Text>
        <Text style={styles.value}>{trip.deviceName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{trip.tripEvent}</Text>
      </View>
      {trip.isOngoing && (
        <View style={styles.ongoingBadge}>
          <Text style={styles.ongoingText}>Ongoing</Text>
        </View>
      )}
    </View>
  </View>
);

const SafetyTagTrips = ({trips = [], isLoading = false}) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recorded Trips</Text>
      {trips.map((trip, index) => (
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
  ongoingBadge: {
    backgroundColor: '#4CAF50',
    padding: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  ongoingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SafetyTagTrips;
