import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const BackArrow = ({height, width, color, onPress}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    onPress={onPress}
    viewBox="0 0 448 512">
    <Path
      d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.3l105.3-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
      fill={color}
    />
  </Svg>
);
export default BackArrow;
