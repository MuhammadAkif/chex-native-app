import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {buttonTextStyle, colors as color} from '../Assets/Styles';

const VehicleTypeButton = React.memo(({
  text,
  onPress,
  isLoading = false,
  isDisabled = false,
  buttonStyle,
  textStyle,
  loaderSize = 'small',
  loaderColor = color.white,
  colors = ['#FF7A00', '#F90'],
}) => {
  const isButtonDisabled = isDisabled || isLoading;

  // Memoize button content to prevent unnecessary re-renders
  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <ActivityIndicator size={loaderSize} color={loaderColor} />;
    }
    return (
      <Text disabled={isButtonDisabled} style={[buttonTextStyle, textStyle]}>
        {text}
      </Text>
    );
  }, [isLoading, loaderSize, loaderColor, isButtonDisabled, text, textStyle]);

  // Memoize button styles to prevent unnecessary style recalculations
  const buttonStyles = useMemo(() => [
    styles.buttonContainer, 
    buttonStyle,
    isButtonDisabled && styles.disabledButton
  ], [buttonStyle, isButtonDisabled]);

  // Memoize prop objects to reduce environmental impact
  const touchableProps = useMemo(() => ({
    onPress,
    disabled: isButtonDisabled,
  }), [onPress, isButtonDisabled]);

  const gradientProps = useMemo(() => ({
    colors,
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
    style: buttonStyles,
  }), [colors, buttonStyles]);

  return (
    <TouchableOpacity {...touchableProps}>
      <LinearGradient {...gradientProps}>
        {buttonContent}
      </LinearGradient>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default VehicleTypeButton; 