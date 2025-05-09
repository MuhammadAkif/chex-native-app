import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors, NewInspectionStyles} from '../Assets/Styles';
import TripCard from '../Components/TripCard';
import {BackArrow} from '../Assets/Icons';

const {black, white} = colors;
const {container, bodyContainer} = NewInspectionStyles;

const TripHistoryScreen = ({onBackPress, trips}) => (
  <View style={[container, styles.container]}>
    <View style={[bodyContainer, styles.header]}>
      <TouchableOpacity style={styles.headerContainer} onPress={onBackPress}>
        <BackArrow
          height={hp('5%')}
          width={wp('6%')}
          color={black}
          onPress={onBackPress}
        />
        <Text style={styles.bodyHeaderTitleText}>Trip History</Text>
      </TouchableOpacity>
    </View>
    <View style={[styles.backgroundColor, styles.body]}>
      <FlatList
        data={trips}
        renderItem={({item}) => <TripCard trip={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyDataContainer}>
            <Text style={styles.emptyDataText}>No Trip history</Text>
          </View>
        }
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0,
    height: hp('10%'),
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  bodyHeaderTitleText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  backgroundColor: {backgroundColor: white},
  body: {
    flex: 10,
  },
  emptyDataText: {
    color: black,
    fontSize: hp('2%'),
  },
  emptyDataContainer: {
    height: hp('50%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TripHistoryScreen;
