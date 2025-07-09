import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {BackArrow} from '../../Assets/Icons';
import ClockIcon from '../../Assets/Icons/ClockIcon';
import LocationIcon from '../../Assets/Icons/Location';
import {colors, NavigationDrawerBackgroundColor} from '../../Assets/Styles';

const TripHistoryScreen = ({trips = [], navigation, onPressClear}) => {
  // Helper to format time in 12-hour lowercase am/pm
  function formatTime(time) {
    if (!time) return '-';
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  }

  const renderTrip = ({item}) => (
    <View style={styles.card}>
      {/* Date and Status Row */}
      <View style={styles.rowBetween}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>
      </View>
      {/* Time and Duration Row */}
      <View style={[styles.rowBetween, {marginTop: hp('1.2%')}]}>
        <View style={styles.rowCenter}>
          {/* <Ionicons name="time-outline" size={wp('4%')} color={colors.gray} style={{marginRight: 4}} /> */}
          <ClockIcon />
          <Text style={styles.timeText}>{formatTime(item.time)}</Text>
        </View>
        <Text style={styles.durationLabel}>
          Duration:{' '}
          <Text style={styles.durationValue}>{item.duration} mins</Text>
        </Text>
      </View>
      {/* Locations */}
      <View style={{marginTop: hp('1%'), gap: hp('.8%')}}>
        <View style={styles.locationRow}>
          <View
            style={[styles.routeIcon, {backgroundColor: colors.brightGreen}]}>
            <LocationIcon width={wp('3.2%')} height={wp('3.2%')} />
          </View>
          <Text style={styles.locationText}>{item.startLocation}</Text>
        </View>
        <View style={styles.locationRow}>
          <View style={[styles.routeIcon, {backgroundColor: colors.red}]}>
            <LocationIcon width={wp('3.2%')} height={wp('3.2%')} />
          </View>
          <Text style={styles.locationText}>{item.endLocation}</Text>
        </View>
      </View>
      {/* Divider */}
      <View style={styles.divider} />
      {/* Distance and Avg Speed */}
      <View style={styles.rowBetween}>
        <Text style={styles.distanceLabel}>
          Distance: <Text style={styles.distanceValue}>{item.distance} km</Text>
        </Text>
        <Text style={styles.avgSpeedLabel}>
          Avg Speed:{' '}
          <Text style={styles.avgSpeedValue}>{item.avgSpeed} km/h</Text>
        </Text>
      </View>
    </View>
  );
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation?.goBack?.()}>
        <BackArrow height={hp('5%')} width={wp('5%')} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Trip History</Text>
    <TouchableOpacity onPress={onPressClear}>
      <Text style={styles.headerClearText}>Clear</Text>
    </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.bodyContainer}>
          {/* List */}
          <FlatList
            data={trips}
            keyExtractor={item => item.id}
            renderItem={renderTrip}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noTripData}>
                <Text style={styles.noTripDataText}>No Trip</Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
};

function formatDate(dateStr) {
  // Expects YYYY-MM-DD, returns e.g. May 5, 2025
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NavigationDrawerBackgroundColor,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    backgroundColor: colors.white,
    gap: wp('3%'),
  },
  headerBack: {
    marginRight: wp('3%'),
    padding: 4,
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: colors.black,
    flex: 1
  },
  headerClearText: {
    textDecorationLine:'underline',
    color: colors.black
  },
  listContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  dateText: {
    fontSize: wp('3.5%'),
    color: colors.black,
    fontFamily: 'normal',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#D6F5E6',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.3%'),
  },
  statusBadgeText: {
    color: '#2ECC71',
    fontSize: wp('3.2%'),
  },
  timeText: {
    fontSize: wp('3.2%'),
    color: '#888888',
  },
  durationLabel: {
    fontSize: wp('3.2%'),
    color: '#888888',
    textAlign: 'right',
    fontFamily: 'normal',
  },
  durationValue: {
    color: colors.black,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  locationText: {
    fontSize: hp('1.5%'),
    color: colors.black,
    marginLeft: wp('2%'),
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: hp('1.5%'),
  },
  distanceLabel: {
    fontSize: hp('1.5%'),
    color: '#888888',
  },
  distanceValue: {
    color: colors.black,
    fontWeight: '500',
  },
  avgSpeedLabel: {
    fontSize: hp('1.5%'),
    color: '#888888',
  },
  avgSpeedValue: {
    color: colors.black,
    fontWeight: '500',
  },
  routeIcon: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('100%'),
    padding: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTripData: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  noTripDataText: {fontSize: hp('1.8%'), color: colors.black},
});

export default TripHistoryScreen;
