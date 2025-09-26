import {StyleSheet} from 'react-native';
import {colors} from '../../../Assets/Styles';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  blueContainer: {flex: 1, backgroundColor: colors.royalBlue},
  container: {flex: 1},
  blueHeaderContainer: {backgroundColor: colors.royalBlue, height: hp(32)},
  whiteContainerContent: {flex: 1, marginTop: -hp(6)},
  username: {fontWeight: '500'},
  usernameContainer: {marginTop: hp(4), paddingHorizontal: wp(5)},
  scrollContentContainer: {flexGrow: 1, backgroundColor: colors.white, paddingBottom: hp(3)},
  vanoutlineContainer: {position: 'absolute', right: 0, bottom: hp(3), width: wp(40), height: wp(40), resizeMode: 'contain'},
  statBoxContainer: {
    flex: 1,
    minWidth: wp(40),
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
  },
  withHeadingContentContainer: {flex: 1},
  headingText: {fontWeight: '600', fontSize: wp(4), paddingHorizontal: wp(5)},
  sectionWrapper: {marginTop: hp(3), gap: hp(1)},
  vehicleList: {paddingVertical: wp(2)},
  vehicleContentList: {paddingHorizontal: wp(5), flexGrow: 1, gap: wp(4)},
  noRegisterText: {textAlign: 'center', flex: 1},
  registerVehicleLoader: {alignSelf: 'center', flex: 1},
});
