import React from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {buttonTextStyle, colors} from '../Assets/Styles';

const ButtonText = (text, textStyle, disabled) => (
  <Text disabled={disabled} style={[buttonTextStyle, textStyle]}>
    {text}
  </Text>
);
const Loader = (loaderSize, loaderColor) => (
  <ActivityIndicator size={loaderSize} color={loaderColor} />
);

const PrimaryGradientButton = ({
  buttonStyle,
  textStyle,
  onPress,
  text,
  disabled = false,
  loaderSize = 'small',
  loaderColor = colors.white,
  color = ['#FF7A00', '#F90'],
}) => {
  const BUTTON = {
    true: () => Loader(loaderSize, loaderColor),
    false: () => ButtonText(text, textStyle, disabled),
  };
  const ButtonComponent = BUTTON[disabled];
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={color}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.buttonContainer, buttonStyle]}>
        <ButtonComponent />
      </LinearGradient>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PrimaryGradientButton;
