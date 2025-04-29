import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {colors} from '../../../../Assets/Styles';

const {black, steelGray} = colors;

export const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: hp('1.7%'),
    color: black,
  },
  email: {
    fontSize: hp('1.5%'),
    color: steelGray,
  },
});
