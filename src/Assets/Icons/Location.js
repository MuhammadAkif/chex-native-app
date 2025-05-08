import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Svg, {Path} from 'react-native-svg';

import {colors} from '../Styles';

const {white} = colors;

const Location = ({height = hp('2%'), width = wp('4%'), color = white}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 7 9">
    <Path
      fill={color}
      d="M3.5 1.125A2.625 2.625 0 0 0 .875 3.75c0 1.074.668 2.109 1.402 2.911A10 10 0 0 0 3.5 7.785q.099-.075.23-.184a10 10 0 0 0 .993-.94c.734-.802 1.402-1.837 1.402-2.91A2.625 2.625 0 0 0 3.5 1.124m0 7.58-.213-.146-.003-.002-.007-.005-.029-.02-.1-.074a10.5 10.5 0 0 1-1.425-1.29C.957 6.328.125 5.114.125 3.75a3.375 3.375 0 0 1 6.75 0c0 1.364-.832 2.579-1.598 3.417a10.5 10.5 0 0 1-1.553 1.384l-.008.005-.002.002h-.001zM3.5 3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5M2 3.75a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"
    />
  </Svg>
);

export default Location;
