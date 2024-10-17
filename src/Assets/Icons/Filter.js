import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';

const {white} = colors;

const Filter = ({
  height = hp('3%'),
  width = wp('6%'),
  color = white,
  onPress,
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    fill={'none'}
    onPress={onPress}
    viewBox="0 0 13 8">
    <Path
      d="M2.4 3.2H10.4V4.8H2.4V3.2ZM0 0H12.8V1.6H0V0ZM4.8 6.4H8V8H4.8V6.4Z"
      fill={color}
    />
  </Svg>
);
export default Filter;
