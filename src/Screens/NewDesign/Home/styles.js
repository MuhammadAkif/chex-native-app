import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../../Assets/Styles';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Platforms} from '../../../Constants';

export const styles = StyleSheet.create({
  blueContainer: {flex: 1, backgroundColor: colors.royalBlue},
  container: {flex: 1},
  blueHeaderContainer: {backgroundColor: colors.royalBlue, height: hp(32), paddingHorizontal: wp(5)},
  whiteContainerContent: {flex: 1, bottom: hp(6)},
  iconWrapperContainer: {
    backgroundColor: '#1E7DCB',
    width: 45,
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {fontSize: wp(6.5)},
  logoContainer: {height: undefined, width: undefined, alignItems: undefined, justifyContent: undefined},
  headerContentContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  username: {fontWeight: '500'},
  usernameContainer: {marginTop: hp(4)},
  scrollContentContainer: {flexGrow: 1, backgroundColor: colors.white},
  vanoutlineContainer: {position: 'absolute', right: 0, bottom: hp(3), width: wp(40), height: wp(40), resizeMode: 'contain'},
  statBoxContainer: {
    width: wp(43),
    height: wp(30),
    padding: wp(5),
    gap: wp(1),
  },
  numberAndIcon: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  statNumberText: {fontWeight: '700'},
  statText: {fontWeight: '500'},
  statsContainer: {
    paddingHorizontal: wp(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp(4),
    zIndex: 1,
  },

  withHeadingContentContainer: {flex: 1},
  headingText: {fontWeight: '600', fontSize: wp(4), paddingHorizontal: wp(5)},
  sectionWrapper: {marginTop: hp(3), gap: hp(1)},
  cardContainer: {
    backgroundColor: colors.white,
    borderWidth: Platform.OS === Platforms.ANDROID ? 0.5 : undefined,
    borderColor: colors.gray,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 20,
  },
  vehicleList: {paddingVertical: wp(2)},
  vehicleContentList: {paddingHorizontal: wp(5), flexGrow: 1, gap: wp(4)},
});
