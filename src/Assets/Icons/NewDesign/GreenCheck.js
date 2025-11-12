import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function GreenCheckIcon(props) {
  return (
    <Svg width={33} height={32} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect x={0.339844} width={32} height={32} rx={16} fill="#11D452" fillOpacity={0.1} />
      <Path
        d="M22.873 14.667a6.667 6.667 0 11-3.2-4.444M14.34 15.333l2 2 6.666-6.666"
        stroke="#11D452"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default GreenCheckIcon;
