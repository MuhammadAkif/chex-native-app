import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../Styles';

const {royalBlue} = colors;

const Bluetooth = ({
  height = hp('4%'),
  width = wp('4%'),
  color = royalBlue,
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 18 34">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="m1.5 9.5 15 15L9 32V2l7.5 7.5-15 15"
    />
  </Svg>
);

export default Bluetooth;
