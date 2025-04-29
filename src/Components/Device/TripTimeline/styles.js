import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../../Assets/Styles';

const {black, steelGray, gray} = colors;

const styles = StyleSheet.create({
  container: {
    gap: wp('5%'),
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  statusListContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: wp('1%'),
  },
  statusContainer: {
    marginTop: hp('1%'),
    alignItems: 'center',
    marginRight: wp('3%'),
    rowGap: wp('1%'),
  },
  dot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('100%'),
  },
  verticalLine: {
    flex: 0.8,
    width: wp('0.5%'),
    backgroundColor: gray,
  },
  addressContainer: {
    flex: 1,
  },
  addressBlock: {
    marginBottom: wp('5%'),
    rowGap: wp('1%'),
  },
  statusListTitle: {
    fontSize: hp('1.8%'),
    color: black,
  },
  address: {
    fontSize: hp('1.5%'),
    color: steelGray,
  },
  zeroMargin: {marginBottom: 0},
});

export default styles;
