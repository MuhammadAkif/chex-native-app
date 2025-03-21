import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';

const {black, white, gray, brightGreen, red} = colors;

const StatBox = ({label, value, unit, color}) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, color && {color}]}>
      {value}
      <Text style={styles.statUnit}>{unit}</Text>
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const CrashEventDisplay = () => {
  const {crashEvents, thresholdEvents, error} = useSelector(
    state => state.crashDetection,
  );

  // Calculate statistics
  const totalCrashes = crashEvents?.data?.length || 0;
  const totalThresholds = thresholdEvents?.length || 0;

  // Get the most recent crash event
  const latestCrash = crashEvents?.data?.[0];
  const maxAcceleration = latestCrash
    ? Math.max(
        ...latestCrash.accelerometerValues.map(v =>
          Math.sqrt(
            v.xAxisMg * v.xAxisMg +
              v.yAxisMg * v.yAxisMg +
              v.zAxisMg * v.zAxisMg,
          ),
        ),
      ).toFixed(1)
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crash Detection</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.statsContainer}>
        <StatBox
          label="Crash Events"
          value={totalCrashes}
          unit=""
          color={totalCrashes > 0 ? red : undefined}
        />
        <StatBox
          label="Threshold Events"
          value={totalThresholds}
          unit=""
          color={totalThresholds > 0 ? brightGreen : undefined}
        />
        <StatBox label="Max G-Force" value={maxAcceleration} unit="g" />
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
    color: black,
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
  error: {
    color: red,
    fontSize: hp('1.8%'),
    marginBottom: wp('2%'),
    textAlign: 'center',
  },
  configContainer: {
    marginTop: wp('3%'),
    paddingTop: wp('3%'),
    borderTopWidth: 1,
    borderTopColor: gray,
  },
  configTitle: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('1%'),
  },
  configText: {
    fontSize: hp('1.6%'),
    color: gray,
  },
});

export default CrashEventDisplay;
