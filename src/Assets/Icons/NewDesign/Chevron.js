import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ChevronIcon(props) {
  return (
    <Svg width={12} height={8} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M1 1.5l5 5 5-5" stroke="#667085" strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default ChevronIcon;
