import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const {height, width} = Dimensions.get('window');

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
  red: '#FF0000',
  orange: '#FF9900',
  royalBlue: '#1468BA',
  cobaltBlue: '#4A93E9',
  lightSteelBlue: '#B8BFD2',
  paleBlue: '#E7EFF8',
  tealGreen: '#20C18D',
  skyBlue: '#55A4F1',
  brightGreen: '#75BA5C',
  steelGray: '#767E85',
  navyBlue: '#1F3B55',
  brightBlue: '#1262B1',
  orangePeel: '#FF7A00',
  lightSkyBlue: '#E7EEF5',
  cobaltBlueTwo: '#0B5EAF',
  blueGray: '#97A9C5',
  deepGreen: '#3D903C',
  silverGray: '#F3F3F3',
  lightGray: '#FAFAFA',
  icyBlue: '#EFFBF7',
};

export const buttonTextStyle = {
  color: colors.white,
  fontSize: hp('2%'),
  fontWeight: 'bold',
};
export const circleBorderRadius = Math.round(height + width) / 2;
export const NavigationDrawerBackgroundColor = 'rgba(0, 27, 81, 0.8)';
export const dot = {
  height: 5,
  width: 5,
  borderRadius: 50,
  top: '1%',
  marginRight: 5,
  backgroundColor: colors.black,
};
export const ShadowEffect = {
  shadowColor: '#ccc',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
};
export const errorStyle = StyleSheet.create({
  errorsTextStyle: {
    color: colors.red,
    fontSize: hp('1.5%'),
  },
  errorsContainer: {
    position: 'absolute',
    left: 20,
    top: -10,
    backgroundColor: colors.lightSkyBlue,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
export const expandedCardStyles = StyleSheet.create({
  expandedCardContainer: {
    width: wp('90%'),
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: '#ECECEC',
    ...ShadowEffect,
  },
  uploadImageContainer: {
    height: hp('15%'),
    width: wp('35%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1E3F7',
  },
  cameraIconContainer: {
    height: width * 0.14,
    width: width * 0.14,
    borderRadius: circleBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paleBlue,
  },
  uploadImageText: {
    fontSize: hp('1.8%'),
    color: colors.black,
    paddingTop: '2%',
    fontWeight: '500',
  },
  uploadImageAndTextContainer: {
    alignItems: 'center',
  },
  pickerTextSize: {
    fontSize: hp('1.5%'),
  },
  textColor: {
    color: colors.royalBlue,
  },
  crossContainer: {
    position: 'absolute',
    zIndex: 1,
    right: '5%',
    top: -3,
  },
});
export const NewInspectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NavigationDrawerBackgroundColor,
  },
  headerContainer: {
    flex: 0.5,
    paddingTop: '3%',
    alignItems: 'center',
  },
  headerTitleText: {
    width: wp('70%'),
    fontSize: hp('2%'),
    textAlign: 'center',
    color: '#77A1DF',
  },
  backIconContainer: {
    marginLeft: wp('2.5%'),
    width: wp('10%'),
  },
  bodyContainer: {
    flex: 5,
    marginTop: '3%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
  },
  bodyHeaderContainer: {
    width: wp('100%'),
    paddingVertical: '3%',
    alignItems: 'center',
    backgroundColor: 'hsla(36, 100%, 90%, 100)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bodyHeaderTitleText: {
    color: '#EB8D00',
  },
  innerBody: {
    flex: 1,
    alignItems: 'center',
  },
  scrollViewContainer: {
    alignItems: 'center',
    width: wp('100%'),
  },
  footerContainer: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export const PreviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
  },
  recordingPreviewContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
  },
  crossIconContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 20,
    right: 20,
  },
  videoContainer: {
    flex: 1,
    width: wp('90%'),
  },
  headerContainer: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' && '8%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    zIndex: 1,
  },
  counterContainer: {
    height: hp('5%'),
    width: wp('15%'),
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  counterText: {
    fontSize: hp('2.8%'),
    color: colors.white,
  },
});

export const ExpandedCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  itemPickerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
});

export const ItemPickerStyles = StyleSheet.create({
  container: {
    height: hp('15%'),
    width: wp('35%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const modalLoadingIndicatorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    paddingTop: hp('7%'),
  },
});

export const modalStyle = StyleSheet.create({
  modalOuterContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
  },
  header: {
    fontSize: hp('2%'),
    color: colors.black,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 30,
  },
  body: {
    fontSize: hp('1.7%'),
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontWeight: 'bold',
    color: colors.black,
  },
  footer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    height: hp('4%'),
    width: wp('30%'),
  },
  noButton: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.brightBlue,
  },
  noTextStyle: {
    color: colors.brightBlue,
    fontWeight: 500,
  },
  yesText: {
    fontWeight: 500,
  },
});
