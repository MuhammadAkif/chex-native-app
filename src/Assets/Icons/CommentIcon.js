import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Styles';

const {white} = colors;

const CommentIcon = ({height = hp('5%'), width = wp('5%'), color = white}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    // style={{borderWidth: 1}}
    viewBox="0 0 26 26">
    <Path
      fill={color}
      d="M11.75 15.5h2.5v-3.75H18v-2.5h-3.75V5.5h-2.5v3.75H8v2.5h3.75zM.5 25.5V3q0-1.031.735-1.765A2.41 2.41 0 0 1 3 .5h20q1.032 0 1.766.735.735.735.734 1.765v15a2.4 2.4 0 0 1-.734 1.766q-.734.735-1.766.734H5.5zM4.438 18H23V3H3v16.406z"
    />
  </Svg>
);

export default CommentIcon;
