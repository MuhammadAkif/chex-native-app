import {View, StyleSheet} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppText from './text';
import {colors} from '../Assets/Styles';
import GreenCheckIcon from '../Assets/Icons/NewDesign/GreenCheck';
import CardWrapper from './Card/CardWrapper';

const InspectionCard = ({item}) => {
  let statusBGColor = colors.tealGreen;
  if (item.status == 'Pending') statusBGColor = colors.orange;

  return (
    <CardWrapper style={styles.container}>
      <View style={styles.contentContainer}>
        <AppText fontSize={wp(3.8)} fontWeight={'800'}>
          {item?.licencseNumber}
        </AppText>
        <AppText color={colors.steelGray}>ID: VH-2847</AppText>
        <View style={styles.rowItem}>
          <View style={[styles.statusContainer, {backgroundColor: statusBGColor}]}>
            <AppText fontWeight={'700'} fontSize={wp(3.2)} color={colors.white}>
              {item?.status}
            </AppText>
          </View>
          {item?.days && (
            <AppText color={colors.red} fontSize={wp(3.2)}>
              {item?.days}
            </AppText>
          )}
        </View>
      </View>

      {item.status == 'Passed' && <GreenCheckIcon style={styles.check} />}

      <View style={styles.inspectionBy}>
        <AppText color={colors.steelGray} fontSize={wp(2.8)}>
          By Sarah Chen
        </AppText>
        <AppText color={colors.steelGray} fontSize={wp(2.8)}>
          2 hours ago
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
