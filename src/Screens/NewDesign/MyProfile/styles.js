import { StyleSheet } from 'react-native';
import { colors, expandedCardStyles } from '../../../Assets/Styles';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const CARD_PADDING = wp(4);

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.royalBlue },
  scrollContentContainer: { flexGrow: 1, paddingBottom: hp(3), paddingHorizontal: CARD_PADDING },
  scrollContainer: { flex: 1 },
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
  infoContainer: { gap: 7 },
  cardWrapper: { flex: 1, backgroundColor: colors.white },
  blueHeaderContainer: { backgroundColor: colors.royalBlue, height: hp(22) },
  inputsContainer: { gap: 15, marginTop: '5%' },
  nextButton: { height: hp(5), width: '80%', alignSelf: 'center', marginTop: hp(3) },
  inputContainer: {
    height: hp('5%'),
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: expandedCardStyles.uploadImageContainer.borderColor,
  },
  input: { fontSize: wp(3.5) },
  flex1: { flex: 1 },
  languageContainer: {
    marginTop: hp(0.5),
  },
  languageLabel: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: colors.black,
    marginBottom: hp(0.8),
  },
  languageDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  languageText: {
    color: colors.black,
    fontSize: wp(3.5),
  },
  languageDropdownList: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp(2),
    marginTop: hp(0.8),
    overflow: 'hidden',
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageOption: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  languageOptionSelected: {
    backgroundColor: '#F0F6FF',
  },
  languageOptionText: {
    fontSize: wp(3.5),
    color: colors.black,
  },
  languageOptionTextSelected: {
    color: colors.royalBlue,
    fontWeight: '600',
  },
});
