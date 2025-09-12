import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';

const CARD_PADDING = wp(4);
export const styles = StyleSheet.create({
  blueContainer: {flex: 1, backgroundColor: colors.royalBlue},
  container: {flex: 1},
  blueHeaderContainer: {backgroundColor: colors.royalBlue, height: hp(22), paddingHorizontal: wp(5)},
  whiteContainerContent: {
    flex: 1,
    bottom: hp(6),
    backgroundColor: colors.white,
    borderRadius: wp(7),
    marginHorizontal: wp(3),
  },
  scrollContentContainer: {flexGrow: 1, backgroundColor: colors.white},
  infoContainer: {paddingHorizontal: CARD_PADDING, paddingVertical: hp(3), gap: 7},
  vehicleTypeContainer: {gap: 15},
  vehicleTypeText: {paddingHorizontal: CARD_PADDING, marginBottom: 8},
  vehicleTypeContentList: {flexGrow: 1, gap: 10, paddingHorizontal: CARD_PADDING},
  vehicleItemContainer: {width: wp(38), height: wp(38), borderRadius: 15, alignItems: 'center', padding: 4.5, paddingBottom: 0},
  vehicleItemImageContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '80%',
  },
  vehicleImg: {width: '85%', height: '80%', resizeMode: 'contain'},
  vehicleItemName: {justifyContent: 'center', flex: 1},
  inputsContainer: {paddingHorizontal: CARD_PADDING},
});
