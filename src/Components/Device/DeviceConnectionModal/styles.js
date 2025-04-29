import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  iconContainer: {
    height: wp('13%'),
    width: wp('13%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
    backgroundColor: 'rgba(0, 27, 81, 0.07)',
  },
  modalContainer: {
    gap: wp('4%'),
  },
  title: {
    textAlign: 'center',
  },
  description: {
    fontWeight: 'normal',
  },
  button: {
    height: hp('4.8%'),
    width: wp('37%'),
  },
});

export default styles;
