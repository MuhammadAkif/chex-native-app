import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../Assets/Styles';

const {black, royalBlue, white, gray, steelGray, lightGray, orangePeel} =
  colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    color: black,
  },
  commentBox: {
    backgroundColor: 'rgba(20, 103, 184, 0.10)',
    borderColor: 'rgba(20, 103, 184, 0.50)',
    borderWidth: 2,
    borderRadius: wp('1.5%'),
    paddingHorizontal: wp('2%'),
    paddingTop: wp('3%'),
    paddingBottom: wp('5%'),
    maxHeight: hp('10%'),
  },
  comment: {
    color: royalBlue,
    fontSize: hp('1.8%'),
  },
  time: {
    fontSize: hp('1.3'),
    color: black,
    position: 'absolute',
    right: wp('2%'),
    bottom: wp('1%'),
  },
  iconContainer: {
    height: wp('13%'),
    width: wp('13%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
    backgroundColor: 'rgba(0, 27, 81, 0.07)',
  },
  listIconContainer: {
    height: wp('8%'),
    width: wp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
    backgroundColor: 'rgba(0, 27, 81, 0.07)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: wp('90%'),
    borderRadius: wp('3%'),
    gap: wp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: wp('5%'),
  },
  modalHeader: {
    alignItems: 'center',
  },
  modalBody: {
    width: wp('80%'),
    maxHeight: hp('60%'),
    minHeight: hp('20%'),
  },
  modalFooter: {
    flexDirection: 'row',
    width: wp('80%'),
    justifyContent: 'space-around',
  },
  modalTitle: {
    color: black,
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  commentSectionTitle: {
    color: royalBlue,
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
  fieldGap: {
    gap: wp('2%'),
  },
  input: {
    height: hp('15%'),
    backgroundColor: gray,
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    color: black,
  },
  addButton: {
    width: wp('35%'),
    height: hp('5%'),
    borderRadius: wp('50%'),
  },
  cancelButton: {
    height: hp('5%'),
    width: wp('35%'),
    borderRadius: hp('10%'),
    borderColor: royalBlue,
    borderWidth: 2,
  },
  connectButton: {
    height: hp('4%'),
    width: wp('25%'),
    borderRadius: hp('10%'),
    borderColor: orangePeel,
    borderWidth: 2,
  },
  cancelTextStyle: {
    color: royalBlue,
    fontWeight: '600',
  },
  addTextStyle: {
    fontWeight: '600',
  },
  deviceList: {
    alignItems: 'center',
    paddingVertical: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp('2%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F1F1F1',
    gap: wp('2%'),
  },
  deviceListText: {
    fontSize: hp('2%'),
    width: wp('40%'),
    color: black,
  },
  connectText: {
    color: orangePeel,
  },
  headerColor: {
    backgroundColor: 'white',
    marginVertical: 0,
    borderColor: '#DADADA',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rescanButton: {
    borderColor: royalBlue,
  },
});
export default styles;
