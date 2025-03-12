import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../Assets/Styles';

const {black, white, gray, brightGreen} = colors;

const StatBox = ({label, value, unit}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>
      {value}
      <Text style={styles.statUnit}>{unit}</Text>
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const CrashEventDisplay = () => {
  const {crashEvents} = useSelector(state => state.crashDetection);
  
  // Calculate statistics
  const totalCrashes = crashEvents?.length || 0;
  const averageForce = crashEvents?.length
    ? (
        crashEvents.reduce((sum, event) => sum + event.impactForce, 0) /
        crashEvents.length
      ).toFixed(1)
    : 0;
  const maxForce = crashEvents?.length
    ? Math.max(...crashEvents.map(event => event.impactForce)).toFixed(1)
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crash Statistics</Text>
      <View style={styles.statsContainer}>
        <StatBox
          label="Total Events"
          value={totalCrashes}
          unit=""
        />
        <StatBox
          label="Avg Force"
          value={averageForce}
          unit="g"
        />
        <StatBox
          label="Max Force"
          value={maxForce}
          unit="g"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: white,
    padding: wp('4%'),
    borderRadius: wp('2%'),
    marginVertical: wp('2%'),
    shadowColor: black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('3%'),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: wp('2%'),
    borderRightWidth: 1,
    borderRightColor: gray,
  },
  statValue: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: brightGreen,
    marginBottom: wp('1%'),
  },
  statUnit: {
    fontSize: hp('2%'),
    color: gray,
  },
  statLabel: {
    fontSize: hp('1.6%'),
    color: gray,
    textAlign: 'center',
  },
});

export default CrashEventDisplay; 