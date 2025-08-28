import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Defs, LinearGradient as SvgGradient, Stop, Rect} from 'react-native-svg';
import {buttonTextStyle, colors as color} from '../Assets/Styles';

const PrimaryGradientButton = ({
  buttonStyle,
  textStyle,
  onPress,
  text,
  disabled = false,
  loaderSize = 'small',
  loaderColor = color.white,
  colors = ['#FF7A00', '#F90'],
  buttonDisabled = false,
}) => {
  // Flatten styles so we can safely read borderRadius from user styles
  const flattenedStyle = StyleSheet.flatten([styles.buttonContainer, buttonStyle]);
  const borderRadius = flattenedStyle?.borderRadius ?? styles.buttonContainer.borderRadius;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || buttonDisabled} activeOpacity={0.8}>
      <View style={[styles.buttonContainer, buttonStyle]}>
        {/* SVG gradient background */}
        <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
              <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
            </SvgGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={borderRadius} ry={borderRadius} fill="url(#grad)" />
        </Svg>

        {/* Content */}
        <View style={styles.contentWrapper}>
          {disabled ? (
            <ActivityIndicator animating size={loaderSize} color={loaderColor} />
          ) : (
            <Text style={[buttonTextStyle, textStyle]}>{text}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentWrapper: {
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrimaryGradientButton;
