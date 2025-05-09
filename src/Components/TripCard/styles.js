import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';

const {black, steelGray, brightGreen, red} = colors;

const styles = StyleSheet.create({
  container: {
    height: hp('25%'),
    width: wp('90%'),
    alignSelf: 'center',
    justifyContent: 'space-around',
    shadowColor: '#f1f1f1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: wp('4%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('3%'),
  },
  timeAndStatusContainer: {
    gap: wp('1%'),
  },
  textColor: {
    color: black,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  label: {
    color: steelGray,
  },
  statusText: {
    color: brightGreen,
  },
  statusContainer: {
    backgroundColor: '#DBFBE6',
    borderRadius: wp('100%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationGreen: {
    backgroundColor: brightGreen,
    borderRadius: wp('100%'),
    paddingHorizontal: wp('1.2%'),
    paddingVertical: wp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRed: {
    backgroundColor: red,
  },
  tripLocationContainer: {
    gap: wp('3%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F1F1',
    paddingBottom: wp('2%'),
    width: wp('80%'),
    alignSelf: 'center',
  },
  tripIconAndTextContainer: {
    justifyContent: 'flex-start',
    gap: wp('2%'),
  },
  bold: {
    fontWeight: 'bold',
  },
  zeroPadding: {
    paddingHorizontal: 0,
  },
});

export default styles;
