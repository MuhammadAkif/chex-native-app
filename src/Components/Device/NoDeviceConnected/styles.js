import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../../Assets/Styles';

const {black} = colors;

const styles = StyleSheet.create({
  container: {
    height: hp('30%'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: '600',
  },
  description: {
    fontSize: hp('1.5%'),
    width: wp('70%'),
    textAlign: 'center',
  },
  textColor: {
    color: black,
  },
  button: {
    width: wp('60%'),
    borderRadius: wp('50%'),
  },
  iconContainer: {
    height: wp('13%'),
    width: wp('13%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
    backgroundColor: 'rgba(0, 27, 81, 0.07)',
  },
});

export default styles;
