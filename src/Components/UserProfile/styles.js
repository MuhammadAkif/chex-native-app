import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';

const {gray} = colors;

export const styles = StyleSheet.create({
  container: {
    height: hp('12%'),
    borderBottomWidth: 1,
    borderBottomColor: gray,
    marginHorizontal: '1%',
    paddingHorizontal: '5%',
    justifyContent: 'space-evenly',
  },
});
