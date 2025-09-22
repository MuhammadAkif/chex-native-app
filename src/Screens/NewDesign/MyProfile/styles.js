import {StyleSheet} from 'react-native';
import {colors, expandedCardStyles} from '../../../Assets/Styles';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const CARD_PADDING = wp(4);

export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.royalBlue},
  scrollContentContainer: {flexGrow: 1, paddingBottom: hp(3), paddingHorizontal: CARD_PADDING},
  scrollContainer: {flex: 1},
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
  infoContainer: {paddingHorizontal: CARD_PADDING, gap: 7},
  cardWrapper: {flex: 1, backgroundColor: colors.white},
  blueHeaderContainer: {backgroundColor: colors.royalBlue, height: hp(22)},
  inputsContainer: {gap: 15, marginTop: '5%', flex: 1},
  nextButton: {height: hp(5), width: '90%', alignSelf: 'center', marginTop: hp(3)},
  inputContainer: {
    height: hp('5%'),
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: expandedCardStyles.uploadImageContainer.borderColor,
  },
  input: {fontSize: wp(3.5)},
  flex1: {flex: 1},
});
