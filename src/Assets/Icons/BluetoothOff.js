import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../Styles';

const {royalBlue} = colors;

const BluetoothOff = ({
  height = hp('4%'),
  width = wp('7%'),
  color = royalBlue,
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 34 34">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M24.5 24.5 17 32V17l-7.5 7.5M2 2l30 30M20.75 13.25 24.5 9.5 17 2v6.75"
    />
  </Svg>
);

export default BluetoothOff;
