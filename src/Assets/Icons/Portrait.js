import React from 'react';
import Svg, {G, Mask, Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';
import {fallBack} from '../../Utils';

const {white} = colors;

const Portrait = ({
  height = hp('6%'),
  width = wp('10%'),
  color = white,
  onPress = fallBack,
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    onPress={onPress}
    viewBox="0 0 71 72">
    <Mask
      id="mask0_4124_116"
      style={{maskType: 'luminance'}}
      width="71"
      height="72"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse">
      <Path fill={color} d="M0 72V.952h70.979V72H0z" />
    </Mask>
    <G mask="url(#mask0_4124_116)">
      <Path
        fill={color}
        d="M34.01 2.432c0 .817.663 1.48 1.48 1.48 17.936 0 32.531 14.61 32.531 32.563 0 15.29-10.818 24.657-20.702 30.027v-3.496a1.48 1.48 0 10-2.957 0v7.513c0 .817.662 1.48 1.478 1.48h7.378a1.48 1.48 0 000-2.96h-4.397C63.32 61.15 70.98 49.94 70.98 36.475c0-19.588-15.92-35.523-35.49-35.523a1.48 1.48 0 00-1.478 1.48zm-17.728 0c0 .817.662 1.48 1.479 1.48h4.396C7.657 11.802 0 23.012 0 36.475 0 56.066 15.92 72 35.49 72a1.48 1.48 0 000-2.96c-17.938 0-32.533-14.609-32.533-32.564 0-15.29 10.819-24.656 20.703-30.026v3.496a1.48 1.48 0 102.957 0V2.432a1.48 1.48 0 00-1.479-1.48h-7.377a1.48 1.48 0 00-1.479 1.48z"
      />
    </G>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M43.14 20H28.2a1 1 0 00-1 1v31.385a1 1 0 001 1H43.14a1 1 0 001-1V21a1 1 0 00-1-1zM28.2 17a4 4 0 00-4 4v31.385a4 4 0 004 4H43.14a4 4 0 004-4V21a4 4 0 00-4-4H28.201z"
      clipRule="evenodd"
    />
  </Svg>
);

export default Portrait;
