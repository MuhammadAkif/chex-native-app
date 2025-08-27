import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import PrimaryGradientButton from './PrimaryGradientButton';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors as color} from '../Assets/Styles';

const VehicleTypeButton = React.memo(
  ({
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

    // Final button styles
    const buttonStyles = useMemo(
      () => [styles.buttonContainer, buttonStyle, isButtonDisabled && styles.disabledButton],
      [buttonStyle, isButtonDisabled],
    );

    return (
      <PrimaryGradientButton
        onPress={onPress}
        buttonStyle={buttonStyles}
        disabled={isLoading}
        buttonDisabled={isDisabled}
        colors={colors}
        loaderSize={loaderSize}
        loaderColor={loaderColor}
        textStyle={textStyle}
        text={text}
      />
    );
  },
);

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
