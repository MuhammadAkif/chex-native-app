import React from 'react';
import Svg, {Path} from 'react-native-svg';

const Bars = ({height, width, color}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    viewBox="0 0 448 512">
    <Path
      d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z"
      fill={color}
    />
  </Svg>
);
export default Bars;
