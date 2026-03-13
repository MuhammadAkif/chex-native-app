import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppText from './text';
import { colors } from '../Assets/Styles';
import CardWrapper from './Card/CardWrapper';
import { IMAGES } from '../Assets/Images';
import { VEHICLE_IMAGES, VEHICLE_TYPES } from '../Constants';

const VehicleCard = ({ item, onPress }) => {
  return (
    <CardWrapper onPress={onPress} style={styles.container}>
      <Image
        source={
          item?.vehicleType === 'dvir-truck' || item?.vehicleType === 'regular-truck'
            ? VEHICLE_IMAGES[VEHICLE_TYPES.TRUCK]
            : VEHICLE_IMAGES[item?.vehicleType] || IMAGES.Van
        }
        style={styles.image}
      />

      <View style={styles.contentContainer}>
        <AppText fontWeight={'700'} fontSize={wp(3.5)} color={colors.royalBlue}>
          {item?.licensePlateNumber}
        </AppText>
        <AppText fontWeight={'500'}>{item?.companyName}</AppText>
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(60),
    height: wp(25),
    justifyContent: 'center',
    padding: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  image: { width: '35%', height: '100%', resizeMode: 'contain' },
  contentContainer: { flex: 1, gap: 5 },
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
