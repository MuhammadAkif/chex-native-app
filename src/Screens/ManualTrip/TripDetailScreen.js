import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient'; // If not using expo, use react-native-linear-gradient
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {BackArrow} from '../../Assets/Icons';
import CommentIcon from '../../Assets/Icons/CommentIcon'; // Replace with your actual icon if available
import HistoryIcon from '../../Assets/Icons/HistoryIcon';
import LocationIcon from '../../Assets/Icons/Location';
import {colors, NavigationDrawerBackgroundColor} from '../../Assets/Styles';

const TripScreen = ({
  tripStarted = false,
  handleNavigationBackPress,
  onPressStartAndEnd,
  startTime = 'Not Started',
  endTime = 'Not Finished',
  distance = '-',
  duration = '-',
  startLocationName = 'Not Available',
  endLocationName = 'Not Available',
  comments = [],
  commentModalVisible,
  openCommentModal,
  closeCommentModal,
  commentInput,
  handleCommentInputChange,
  handleCommentSubmit,
  onPressViewTripHistory,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.bodyContainer}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            {/* Trip Header */}
            <View style={styles.tripHeader}>
              <View style={styles.backArrowContainer}>
                <TouchableOpacity onPress={handleNavigationBackPress}>
                  <BackArrow height={hp('5%')} width={wp('5%')} />
                </TouchableOpacity>
                <Text style={styles.tripTitle}>Trip</Text>
              </View>

              <TouchableOpacity
                style={styles.historyButton}
                onPress={onPressViewTripHistory}>
                <HistoryIcon />
                <Text style={styles.historyText}>View Trip History</Text>
              </TouchableOpacity>
            </View>

            {/* Trip Information Card */}
            <View style={[styles.card, {padding: 0}]}>
              <View style={styles.lightBlueContainer}>
                <Text style={styles.cardTitle}>Trip Information</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Start Time:</Text>
                  <Text style={styles.infoValue}>{startTime}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>End Time:</Text>
                  <Text style={styles.infoValue}>{endTime}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Distance:</Text>
                  <Text style={styles.infoValue}>{distance}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration:</Text>
                  <Text style={styles.infoValue}>{duration}</Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.infoLabel}>Trip Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      tripStarted && styles.statusBadgeActive,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        tripStarted && styles.statusTextActive,
                      ]}>
                      {tripStarted ? 'ACTIVE' : 'READY'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Trip Route Card */}
            <View style={[styles.card, {padding: 0}]}>
              <View style={styles.tripRouteContainer}>
                <Text style={styles.cardTitle}>Trip Route</Text>

                <View style={styles.routeItem}>
                  <View style={styles.routeIconContainer}>
                    <View
                      style={[
                        styles.routeIcon,
                        {backgroundColor: colors.brightGreen},
                      ]}>
                      <LocationIcon width={wp('3.2%')} height={wp('3.2%')} />
                    </View>
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeLocationTitle}>
                      Start Location
                    </Text>
                    <Text style={styles.routeLocationSubtitle}>
                      {startLocationName}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeDivider} />

                <View style={styles.routeItem}>
                  <View style={styles.routeIconContainer}>
                    <View
                      style={[styles.routeIcon, {backgroundColor: colors.red}]}>
                      <LocationIcon width={wp('3.2%')} height={wp('3.2%')} />
                    </View>
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeLocationTitle}>End Location</Text>
                    <Text style={styles.routeLocationSubtitle}>
                      {endLocationName}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Comments Card */}
            <View style={styles.commentSectionContainer}>
              <View style={styles.commentsHeader}>
                <Text style={styles.cardTitle}>Comment</Text>
                <TouchableOpacity
                  style={styles.addCommentButton}
                  onPress={openCommentModal}>
                  <Text style={styles.addCommentIcon}>+</Text>
                  <Text style={styles.addCommentText}>Add Comments</Text>
                </TouchableOpacity>
              </View>

              {/* Show all comments */}
              {comments && comments.length > 0 ? (
                comments
                  .slice()
                  .reverse()
                  .map((comment, idx) => (
                    <View style={styles.commentItem} key={idx}>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      <Text style={styles.commentTime}>
                        {new Date(comment.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  ))
              ) : (
                <Text style={{color: colors.steelGray, marginTop: 8}}>
                  No comments yet.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Start/End Trip Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressStartAndEnd}
            style={[
              styles.startTripButton,
              tripStarted && styles.endTripButton,
            ]}>
            <Text style={styles.startTripText}>
              {tripStarted ? 'End Trip' : 'Start Trip'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeCommentModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.addCommentModalContent}>
            {/* Top Icon in Circle */}
            <View style={styles.commentIconCircle}>
              {/* Replace with your actual icon */}
              <CommentIcon width={wp('7%')} height={wp('7%')} color="#1976D2" />
            </View>
            {/* Title */}
            <Text style={styles.addCommentTitle}>Add Comment</Text>
            {/* Subtitle */}
            <Text style={styles.addCommentSubtitle}>
              Add a note or comment about this trip
            </Text>
            {/* Input */}
            <TextInput
              style={styles.addCommentInput}
              placeholder="Type your comment here..."
              value={commentInput}
              onChangeText={handleCommentInputChange}
              multiline
              placeholderTextColor="#888"
            />
            {/* Buttons Row */}
            <View style={styles.addCommentButtonRow}>
              {/* Add Button with gradient */}
              <TouchableOpacity
                style={styles.addCommentAddButton}
                onPress={handleCommentSubmit}>
                <LinearGradient
                  colors={[colors.orange, colors.orangePeel]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.addCommentAddButtonGradient}>
                  <Text style={styles.addCommentAddButtonText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.addCommentCancelButton}
                onPress={closeCommentModal}>
                <Text style={styles.addCommentCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  commentSectionContainer: {
    paddingHorizontal: wp('5%'),
    marginVertical: hp('3%'),
  },
  container: {
    flex: 1,
    backgroundColor: NavigationDrawerBackgroundColor,
  },
  backArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  innerContainer: {
    flex: 1,
    paddingTop: 10,
  },
  bodyContainer: {
    flex: 1,
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  tripRouteContainer: {
    backgroundColor: 'rgba(249, 250, 251, 1)',
    padding: wp('5%'),
    borderRadius: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  tripTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: colors.black,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  historyText: {
    fontSize: wp('4%'),
    color: colors.orangePeel,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    borderRadius: wp('3%'),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: wp('5%'),
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: colors.black,
    marginBottom: hp('2%'),
  },
  lightBlueContainer: {
    backgroundColor: 'rgba(20, 103, 184, 0.05)',
    padding: wp('5%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  infoLabel: {
    fontSize: hp('1.6%'),
    color: colors.cobaltBlue,
  },
  infoValue: {
    fontSize: hp('1.6%'),
    color: colors.black,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  statusBadge: {
    backgroundColor: colors.paleBlue,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 20,
  },
  statusText: {
    fontSize: wp('3.2%'),
    color: colors.cobaltBlue,
    fontWeight: '600',
  },
  statusBadgeActive: {
    backgroundColor: colors.icyBlue,
  },
  statusTextActive: {
    color: colors.brightGreen,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIconContainer: {
    width: wp('6%'),
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  routeIcon: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('100%'),
    padding: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routeLocationTitle: {
    fontSize: hp('1.5%'),
    fontWeight: '500',
    color: colors.black,
    marginBottom: hp('0.2%'),
  },
  routeLocationSubtitle: {
    fontSize: hp('1.5%'),
    color: colors.steelGray,
  },
  routeDivider: {
    width: 1,
    height: hp('3%'),
    borderColor: colors.gray,
    marginLeft: wp('3%'),
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCommentIcon: {
    fontSize: wp('4%'),
    color: colors.orangePeel,
    marginRight: wp('1%'),
  },
  addCommentText: {
    fontSize: wp('3.5%'),
    color: colors.orangePeel,
    fontWeight: '500',
  },
  commentItem: {
    backgroundColor: colors.paleBlue,
    borderRadius: 8,
    padding: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20, 103, 184, 0.5)',
    marginTop: hp('1%'),
  },
  commentText: {
    fontSize: wp('3.5%'),
    color: colors.cobaltBlue,
    flex: 1,
  },
  commentTime: {
    fontSize: wp('3%'),
    color: colors.steelGray,
    marginLeft: wp('2%'),
  },
  bottomContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    paddingBottom: hp('3%'),
  },
  startTripButton: {
    backgroundColor: colors.orange,
    borderRadius: wp('100%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('65%'),
    alignSelf: 'center',
  },
  startTripText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: colors.white,
  },
  endTripButton: {
    backgroundColor: '#E85A5A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCommentModalContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: wp('5%'),
    padding: wp('5%'),
    alignItems: 'center',
    alignSelf: 'center',
  },
  commentIconCircle: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('100%'),
    backgroundColor: '#F2F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('2%'),
  },
  addCommentTitle: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: colors.black,
    marginBottom: wp('5%'),
    textAlign: 'center',
  },
  addCommentSubtitle: {
    fontSize: wp('3.5%'),
    color: '#1976D2',
    fontWeight: '500',
    marginBottom: wp('2%'),
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  addCommentInput: {
    width: '100%',
    minHeight: hp('10%'),
    backgroundColor: '#F5F5F5',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    fontSize: wp('3.5%'),
    color: colors.black,
    marginBottom: wp('2%'),
    textAlignVertical: 'top',
  },
  addCommentButtonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: wp('5%'),
  },
  addCommentAddButton: {
    flex: 1,
    marginRight: wp('2%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  addCommentAddButtonGradient: {
    paddingVertical: wp('2%'),
    borderRadius: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCommentAddButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: wp('3.5%'),
  },
  addCommentCancelButton: {
    flex: 1,
    marginLeft: wp('2%'),
    borderRadius: wp('100%'),
    borderWidth: 2,
    borderColor: '#1976D2',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp('2%'),
  },
  addCommentCancelButtonText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: wp('3.5%'),
  },
});

export default TripScreen;
