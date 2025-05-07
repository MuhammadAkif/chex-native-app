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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    color: black,
  },
  statusListContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: wp('0.5%'),
  },
  statusContainer: {
    marginTop: hp('0.2%'),
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
    flex: 0.6,
    width: wp('0.3%'),
    backgroundColor: gray,
  },
  addressContainer: {
    flex: 1,
  },
  addressBlock: {
    marginBottom: wp('3.5%'),
    rowGap: wp('1%'),
  },
  statusListTitle: {
    fontSize: hp('1.5%'),
    color: black,
  },
  address: {
    fontSize: hp('1.3%'),
    color: steelGray,
  },
  zeroMargin: {marginBottom: 0},
});

export default styles;
