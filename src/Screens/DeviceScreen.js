import React from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
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
import CommentSection from '../Components/Device/CommentSection';

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
  handleViewHistoryPress,
  handleAddCommentsPress,
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
        isConnected={isConnected}
        onViewHistoryPress={handleViewHistoryPress}
      />
    </BaseView>
    <BaseView style={[styles.tripTimelineContainer]}>
      <TripTimeline onAddCommentsPress={handleAddCommentsPress} />
    </BaseView>
    <BaseView style={[styles.commentBoxContainer]}>
      <CommentSection />
    </BaseView>
    <DeviceConnectionModal isVisible={false} willDisconnect={false} />
    <BaseView>
      <PrimaryGradientButton
        text={'Disconnect'}
        buttonStyle={styles.button}
        colors={[red, red]}
        onPress={handleDisconnect}
      />
    </BaseView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 0.3,
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('5%'),
  },
  deviceDetailsContainer: {
    flex: 0.5,
  },
  tripDetailsContainer: {
    flex: 1.7,
  },
  tripTimelineContainer: {
    flex: 0.7,
  },
  commentBoxContainer: {
    flex: 0.8,
  },
  button: {
    alignSelf: 'center',
  },
});

export default DeviceScreen;
