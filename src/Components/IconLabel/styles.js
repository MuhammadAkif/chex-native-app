import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';

const {orange} = colors;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  text: {
    fontSize: hp('1.8%'),
    color: orange,
    fontWeight: '600',
  },
});

export default styles;
