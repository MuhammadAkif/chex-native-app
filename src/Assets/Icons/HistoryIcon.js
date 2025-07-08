import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function HistoryIcon(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M2.25 9A6.75 6.75 0 109 2.25a7.313 7.313 0 00-5.055 2.055L2.25 6"
        stroke="#FF7A00"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.25 2.25V6H6M9 5.25V9l3 1.5"
        stroke="#FF7A00"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default HistoryIcon;
