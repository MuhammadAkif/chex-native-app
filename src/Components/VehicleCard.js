import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppText from './text';
import {colors} from '../Assets/Styles';
import CardWrapper from './Card/CardWrapper';
import {IMAGES} from '../Assets/Images';
import dayjs from 'dayjs';

const VehicleCard = ({item}) => {
  return (
    <CardWrapper style={styles.container}>
      <Image source={IMAGES.Van} style={styles.image} />

      <View style={styles.contentContainer}>
        <AppText fontWeight={'700'} fontSize={wp(3.5)} color={colors.royalBlue}>
          {item?.licensePlateNumber}
        </AppText>
        <AppText fontWeight={'500'}>{item?.companyName}</AppText>
        <View style={styles.statusContainer}>
          <AppText fontWeight={'700'} fontSize={wp(3.2)} color={colors.white}>
            {item?.inspectionStatus}
          </AppText>
        </View>
        {item?.reviewedDate && (
          <AppText fontSize={wp(3)} fontWeight={'500'}>
            {dayjs(item?.reviewedDate).format('MMM D, YYYY')}
          </AppText>
        )}
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(80),
    height: wp(35),
    justifyContent: 'center',
    padding: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  image: {width: '35%', height: '100%', resizeMode: 'contain'},
  contentContainer: {flex: 1},
  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealGreen,
    borderRadius: 4,
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    alignItems: 'center',
    marginTop: wp(3.5),
    marginBottom: wp(2),
  },
});

export default VehicleCard;
