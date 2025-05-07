import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  Details,
  PrimaryGradientButton,
  TripDetails,
  TripTimeline,
  DeviceConnectionModal,
} from '../Components';

const {black, white, red} = colors;
const {container, bodyContainer} = NewInspectionStyles;

const BaseView = props => (
  <View style={[styles.backgroundColor, styles.paddingView, props.style]}>
    {props.children}
  </View>
);

const DeviceScreen = ({
  handleDisconnect,
  handleStartScan,
  isConnected,
  deviceTag,
  batteryHealth,
  duration,
  startTime,
  avgSpeed,
  tripStatus,
}) => (
  <View style={[container, styles.container]}>
    <View style={[bodyContainer, styles.body]}>
      <Text style={styles.bodyHeaderTitleText}>Device</Text>
    </View>
    <BaseView style={styles.deviceDetailsContainer}>
      <Details
        isConnected={isConnected}
        deviceTag={deviceTag}
        batteryHealth={batteryHealth}
      />
    </BaseView>
    <BaseView style={[styles.tripDetailsContainer]}>
      <TripDetails
        duration={duration}
        startTime={startTime}
        avgSpeed={avgSpeed}
        tripStatus={tripStatus}
      />
    </BaseView>
    <BaseView style={[styles.tripTimelineContainer]}>
      <TripTimeline />
    </BaseView>
    <DeviceConnectionModal isVisible={false} willDisconnect={false} />
    {isConnected ? (
      <PrimaryGradientButton
        text={'Disconnect'}
        buttonStyle={styles.button}
        colors={[red, red]}
        onPress={handleDisconnect}
      />
    ) : (
      <PrimaryGradientButton
        text={'Connect'}
        buttonStyle={styles.button}
        onPress={handleStartScan}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 0.3,
    height: hp('10%'),
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '3%',
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bodyHeaderTitleText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  backgroundColor: {backgroundColor: white},
  paddingView: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  deviceDetailsContainer: {
    flex: 1,
  },
  tripDetailsContainer: {flex: 3},
  tripTimelineContainer: {flex: 2.5},
  button: {
    position: 'absolute',
    bottom: hp('2%'),
    alignSelf: 'center',
  },
});

export default DeviceScreen;
