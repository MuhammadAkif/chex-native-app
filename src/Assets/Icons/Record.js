import React from 'react';
import Svg, {Circle} from 'react-native-svg';

const Record = ({height, width, color, onPress}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 81 81"
      onPress={onPress}
      fill="none">
      <Circle cx="40.5" cy="36.5" r="35.5" stroke="white" stroke-width="2" />
      <Circle cx="40.5" cy="35.5" r="20.125" fill={color} />
    </Svg>
  );
};

export default Record;
