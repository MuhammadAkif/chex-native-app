import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

import {colors} from '../Styles';

const {white} = colors;

const CrossFilled = ({height, width, color}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    fill="none"
    viewBox="0 0 19 18">
    <Circle cx="9.277" cy="9" r="9" fill={color} />
    <Path
      fill={white}
      d="m6.19 4.816 3.087 3.088 3.072-3.072a.74.74 0 0 1 .528-.232.8.8 0 0 1 .747 1.086.7.7 0 0 1-.163.242L10.35 9l3.112 3.112a.72.72 0 0 1 .216.488.8.8 0 0 1-.8.8.74.74 0 0 1-.552-.216l-3.048-3.088-3.08 3.08a.74.74 0 0 1-.52.224.8.8 0 0 1-.746-1.087.7.7 0 0 1 .162-.241L8.205 9 5.093 5.888a.72.72 0 0 1-.216-.488.8.8 0 0 1 .8-.8c.192.002.376.08.512.216"
    />
  </Svg>
);
export default CrossFilled;
