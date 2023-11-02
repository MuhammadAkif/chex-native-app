import React from 'react';
import {Text, View} from 'react-native';

const Column = ({
  title,
  description,
  containerStyle,
  titleStyle,
  descriptionStyles,
}) => (
  <View style={containerStyle}>
    <Text style={titleStyle}>{title}</Text>
    <Text style={descriptionStyles}>{description}</Text>
  </View>
);
export default Column;
