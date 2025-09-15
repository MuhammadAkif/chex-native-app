import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ReportTabIcon(props) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z"
        stroke={props.stroke || '#657381'}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"
        stroke={props.stroke || '#657381'}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 14l2 2 4-4" stroke={props.stroke || '#657381'} strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default ReportTabIcon;
