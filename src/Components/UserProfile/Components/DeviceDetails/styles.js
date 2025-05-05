import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../../../Assets/Styles';

const {brightGreen, red, black} = colors;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    fontSize: hp('1.5%'),
    width: wp('40%'),
    flexWrap: 'wrap',
    color: black,
  },
  connectionStatusContainer: {
    columnGap: wp('0.8%'),
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('23%'),
    justifyContent: 'flex-end',
  },
  connected: {
    color: brightGreen,
  },
  disconnected: {
    color: red,
  },
  statusText: {
    fontSize: hp('1.3%'),
  },
  circle: {
    height: wp('2.5%'),
    width: wp('2.5%'),
    borderRadius: wp('100%') / 2,
    backgroundColor: brightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
