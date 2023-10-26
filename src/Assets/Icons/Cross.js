import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Cross = ({height, width, color, onPress}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    onPress={onPress}
    fill={'yellow'}
    viewBox="0 0 512 512">
    <Path
      d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm-81-337c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
      fill={color}
    />
  </Svg>
);
export default Cross;
