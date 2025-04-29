import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';

const {royalBlue} = colors;

const Device = ({height = hp('5%'), width = wp('5%'), color = royalBlue}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 12 20">
    <Path
      fill={color}
      d="M9 0a1 1 0 0 1 1 1v4h1a1 1 0 0 1 1 1v8a6 6 0 1 1-12 0V6a1 1 0 0 1 1-1h1V1a1 1 0 0 1 1-1zM8 2H4v3h4z"
    />
  </Svg>
);

export default Device;
