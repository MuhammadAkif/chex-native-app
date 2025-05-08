import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Clock = ({height = hp('2%'), width = wp('4%'), color = '#6E727C'}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 11 10">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.5 2.5V5L7 6.5"
    />
  </Svg>
);

export default Clock;
