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
  labelValuePairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelValuePairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    width: '35%',
    fontSize: hp('1.8%'),
    color: black,
  },
  value: {
    color: royalBlue,
    fontWeight: 'bold',
    width: '55%',
    fontSize: hp('1.6%'),
    textAlign: 'right',
  },
  progressValue: {
    width: '20%',
    flexDirection: 'row',
  },
  deviceConnection: {
    width: wp('75%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldMaxWidth: {
    width: '78%',
  },
  progressFieldMaxWidth: {
    width: '20%',
  },
  progressBar: {
    width: '100%',
    height: 10,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
  },
});

export default styles;
