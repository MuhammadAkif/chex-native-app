import React from 'react';
import {TouchableOpacity} from 'react-native';

const TouchableButton = ({
  onPress,
  style,
  hitSlop = {top: 25, bottom: 25, left: 15, right: 15},
  containerStyle,
  children,
  ...restProps
}) => (
  <TouchableOpacity
    style={style}
    hitSlop={hitSlop}
    onPress={onPress}
    {...restProps}>
    {children}
  </TouchableOpacity>
);

export default TouchableButton;
