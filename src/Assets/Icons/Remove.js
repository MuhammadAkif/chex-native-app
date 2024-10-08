import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';

const {white} = colors;

const Remove = ({
  height = hp('3%'),
  width = wp('4%'),
  backgroundColor = '#FB3131',
  color = white,
  style,
  onPress,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 13 13"
    fill="none"
    onPress={onPress}
    style={style}
    xmlns="http://www.w3.org/2000/svg">
    <Rect width={'13'} height={'13'} fill={backgroundColor} />
    <Path
      d="M10 8.81233L7.68851 6.50042L9.99916 4.18893L8.81149 3L6.49958 5.31149L4.18809 3L3 4.18893L5.31065 6.50042L3 8.81191L4.18893 10L6.49958 7.68851L8.81023 10L10 8.81233Z"
      fill={color}
    />
  </Svg>
);
export default Remove;
