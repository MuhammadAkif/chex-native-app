import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../../Assets/Styles';

const {black, royalBlue} = colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: wp('1%'),
    width: wp('80%'),
    justifyContent: 'center',
  },
  label: {
    width: wp('65%'),
    fontSize: hp('2%'),
    color: black,
  },
  value: {color: royalBlue, fontWeight: 'bold'},
  deviceConnection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
