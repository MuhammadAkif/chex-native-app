import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AppText from './text';
import {colors} from '../Assets/Styles';
import CardWrapper from './Card/CardWrapper';

const VehicleCard = ({item}) => {
  return (
    <CardWrapper style={styles.container}>
      <Image source={item?.image} style={styles.image} />

      <View style={styles.contentContainer}>
        <AppText fontWeight={'700'} fontSize={wp(3.5)} color={colors.royalBlue}>
          {item?.licencseNumber}
        </AppText>
        <AppText fontWeight={'500'}>{item?.name}</AppText>
        <View style={styles.statusContainer}>
          <AppText fontWeight={'700'} fontSize={wp(3.2)} color={colors.white}>
            {item?.status}
          </AppText>
        </View>
        <AppText fontSize={wp(3)} fontWeight={'500'}>
          {item?.timestamp}
        </AppText>
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
