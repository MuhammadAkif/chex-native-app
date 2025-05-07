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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  labeledCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('3%'),
  },
  labelCardContainer: {
    height: hp('8%'),
    width: wp('43%'),
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
    backgroundColor: 'rgba(20, 103, 184, 0.10)',
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
  statusTextColor: {
    color: royalBlue,
  },
});

export default styles;
