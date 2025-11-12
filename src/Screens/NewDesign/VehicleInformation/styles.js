import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors, expandedCardStyles} from '../../../Assets/Styles';

const CARD_PADDING = wp(4);
export const styles = StyleSheet.create({
  blueContainer: {flex: 1, backgroundColor: colors.royalBlue},
  container: {flex: 1},
  blueHeaderContainer: {backgroundColor: colors.royalBlue, height: hp(22)},
  whiteContainerContent: {
    top: -hp(8),
    backgroundColor: colors.white,
    borderRadius: wp(7),
    marginHorizontal: wp(3),
    paddingTop: hp(3),
    paddingBottom: hp(1),
    gap: 15,
    flex: 1,
  },
  scrollContentContainer: {flexGrow: 1, paddingBottom: hp(3)},
  infoContainer: {paddingHorizontal: CARD_PADDING, gap: 7},
  vehicleTypeContainer: {gap: 15, flex: 1, marginTop: 15},
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
  inputsContainer: {paddingHorizontal: CARD_PADDING, gap: 15},
  inputContainer: {
    height: hp('5%'),
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: expandedCardStyles.uploadImageContainer.borderColor,
  },
  input: {fontSize: wp(3.5)},
  nextButton: {height: hp(5), width: '80%', alignSelf: 'center', marginTop: hp(3)},
  cardWrapper: {flex: 1, backgroundColor: colors.white},
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: '5%'},
});
