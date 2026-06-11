import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors, ShadowEffect } from '../../Assets/Styles';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  // Expanded body — holds the input + odometer upload box.
  body: {
    width: wp('90%'),
    backgroundColor: colors.white,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    marginTop: 8,
    ...ShadowEffect,
  },
  odometerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  odometerLabel: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    color: colors.black,
  },
  editMileageText: {
    fontSize: hp('1.4%'),
    fontWeight: '600',
    color: colors.orangePeel,
  },
  imagePickerWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: hp(1),
  },
});
