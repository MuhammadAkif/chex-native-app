import React from 'react';
import Svg, {G, Mask, Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';
import {fallBack} from '../../Utils';

const {white} = colors;

const Landscape = ({
  height = hp('6%'),
  width = wp('10%'),
  color = white,
  onPress = fallBack,
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    onPress={onPress}
    fill="none"
    viewBox="0 0 72 72">
    <Mask
      id="mask0_4124_123"
      style={{maskType: 'luminance'}}
      width="73"
      height="72"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse">
      <Path fill={color} d="M.953.986h71.048v70.979H.953V.986z" />
    </Mask>
    <G mask="url(#mask0_4124_123)">
      <Path
        fill={color}
        d="M70.521 34.997a1.48 1.48 0 00-1.48 1.479c0 17.937-14.61 32.532-32.564 32.532-15.29 0-24.656-10.819-30.027-20.703h3.497a1.48 1.48 0 100-2.957H2.433a1.48 1.48 0 00-1.48 1.479v7.377a1.48 1.48 0 002.96 0v-4.396c7.89 14.497 19.1 22.157 32.564 22.157 19.589 0 35.524-15.92 35.524-35.49a1.48 1.48 0 00-1.48-1.478zm0-17.729a1.48 1.48 0 00-1.48 1.479v4.396C61.15 8.643 49.94.986 36.477.986 16.89.986.953 16.906.953 36.476a1.48 1.48 0 002.96 0c0-17.937 14.61-32.532 32.564-32.532 15.29 0 24.657 10.818 30.027 20.702h-3.496a1.48 1.48 0 00-1.48 1.479 1.48 1.48 0 001.48 1.478h7.513a1.48 1.48 0 001.48-1.478v-7.378a1.48 1.48 0 00-1.48-1.479z"
      />
    </G>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M52.951 44.128V29.189a1 1 0 00-1-1H20.567a1 1 0 00-1 1v14.939a1 1 0 001 1H51.95a1 1 0 001-1zm3-14.939a4 4 0 00-4-4H20.567a4 4 0 00-4 4v14.939a4 4 0 004 4H51.95a4 4 0 004-4V29.189z"
      clipRule="evenodd"
    />
  </Svg>
);

export default Landscape;
