import {View, StyleSheet} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppText from './text';
import {colors} from '../Assets/Styles';
import GreenCheckIcon from '../Assets/Icons/NewDesign/GreenCheck';
import CardWrapper from './Card/CardWrapper';
import {INSPECTION_RESULTS, STATUSES} from '../Constants';

const InspectionCard = ({item}) => {
  let statusBGColor = colors.tealGreen;
  if (INSPECTION_RESULTS[item?.status] == INSPECTION_RESULTS.pending) statusBGColor = colors.orange;

  return (
    <CardWrapper style={styles.container}>
      <View style={styles.contentContainer}>
        <AppText fontSize={wp(3.8)} fontWeight={'800'}>
          {item?.licensePlateNumber}
        </AppText>
        <AppText color={colors.steelGray}>ID: {item?.inspectionCode}</AppText>
        <View style={styles.rowItem}>
          <View style={[styles.statusContainer, {backgroundColor: statusBGColor}]}>
            <AppText fontWeight={'700'} fontSize={wp(3.2)} color={colors.white}>
              {INSPECTION_RESULTS[item?.status] || item?.status}
            </AppText>
          </View>

          {/* <AppText color={colors.red} fontSize={wp(3.2)}>
              {item?.timeAgo}
            </AppText> */}
        </View>
      </View>

      {STATUSES[item?.status] == STATUSES.REVIEWED && <GreenCheckIcon style={styles.check} />}

      <View style={styles.inspectionBy}>
        {item?.userName && (
          <AppText color={colors.steelGray} fontSize={wp(2.8)}>
            By {item?.userName}
          </AppText>
        )}
        <AppText color={colors.steelGray} fontSize={wp(2.8)}>
          {item?.timeAgo}
        </AppText>
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(55),
    height: wp(32),
    padding: wp(3.5),
  },
  rowItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  contentContainer: {gap: wp(1.3), flex: 1},
  statusContainer: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(0.8),
    alignItems: 'center',
  },
  inspectionBy: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  check: {position: 'absolute', right: wp(2), top: wp(2)},
});

export default InspectionCard;
