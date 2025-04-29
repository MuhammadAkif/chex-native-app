import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';

const {silverGray, black, royalBlue} = colors;
const styles = StyleSheet.create({
  container: {
    gap: wp('5%'),
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  labeledCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('5%'),
  },
  labelCardContainer: {
    height: hp('8%'),
    width: wp('42%'),
    backgroundColor: silverGray,
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
  label: {
    fontSize: hp('1.7%'),
    color: royalBlue,
  },
  value: {
    fontSize: hp('2.3%'),
    fontWeight: '500',
    color: black,
  },
  statusCardContainer: {
    height: hp('8%'),
    width: wp('89%'),
    backgroundColor: 'rgba(0, 27, 81, 0.05)',
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
  statusTextColor: {
    color: royalBlue,
  },
});

export default styles;
