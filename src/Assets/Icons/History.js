import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';

const {orangePeel} = colors;

const History = ({
  height = hp('2.2%'),
  width = wp('5%'),
  color = orangePeel,
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 18 18">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M2.25 9A6.75 6.75 0 1 0 9 2.25a7.31 7.31 0 0 0-5.055 2.055L2.25 6"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M2.25 2.25V6H6M9 5.25V9l3 1.5"
    />
  </Svg>
);

export default History;
