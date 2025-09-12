import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../Assets/Styles';

function AppText({children, style, color, fontSize = 14, fontWeight, ...otherProps}) {
  return (
    <Text style={[styles.text, {color: color || colors.black, fontSize, fontWeight: fontWeight || 'normal'}, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
    fontStyle: 'normal',
  },
});

export default AppText;
