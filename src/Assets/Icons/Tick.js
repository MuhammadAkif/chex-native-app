import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Tick = ({height, width, color}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    viewBox="0 0 512 512">
    <Path
      d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm113-303L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
      fill={color}
    />
  </Svg>
);
export default Tick;
