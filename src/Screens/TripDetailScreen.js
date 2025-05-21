import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {IconLabel, TripDetails, TripTimeline} from '../Components';
import CommentSection from '../Components/Device/CommentSection';
import {BackArrow} from '../Assets/Icons';

const {black, white} = colors;
const {container, bodyContainer} = NewInspectionStyles;

const BaseView = props => (
  <View style={[styles.backgroundColor, styles.paddingView, props.style]}>
    {props.children}
  </View>
);

const TripDetailScreen = ({
  isConnected,
  duration,
  startTime,
  avgSpeed,
  distance,
  tripStatus,
  handleViewHistoryPress,
  handleAddCommentsPress,
  commentInfo,
  onBackPress,
}) => (
  <View style={[container, styles.container]}>
    <View style={[bodyContainer, styles.body]}>
      <TouchableOpacity style={styles.headerContainer} onPress={onBackPress}>
        <BackArrow
          height={hp('5%')}
          width={wp('6%')}
          color={black}
          onPress={onBackPress}
        />
        <Text style={styles.title}>Trip Details</Text>
      </TouchableOpacity>
      <IconLabel label={'View Trip History'} />
    </View>
    <View style={styles.innerContainer}>
      <BaseView style={[styles.tripDetailsContainer]}>
        <TripDetails
          duration={duration}
          startTime={startTime}
          avgSpeed={avgSpeed}
          tripStatus={tripStatus}
          isConnected={isConnected}
          distance={distance}
          onViewHistoryPress={handleViewHistoryPress}
          displayHeader={false}
        />
      </BaseView>
      <BaseView style={[styles.tripTimelineContainer]}>
        <TripTimeline onAddCommentsPress={handleAddCommentsPress} />
      </BaseView>
      <BaseView style={[styles.commentBoxContainer]}>
        <CommentSection
          comment={commentInfo?.comment}
          time={commentInfo?.time}
        />
      </BaseView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: white,
    gap: wp('3%'),
  },
  body: {
    flex: 0.1,
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  backgroundColor: {backgroundColor: white},
  paddingView: {
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('5%'),
  },
  tripDetailsContainer: {},
  tripTimelineContainer: {},
  commentBoxContainer: {
    flex: 0.2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
});

export default TripDetailScreen;
