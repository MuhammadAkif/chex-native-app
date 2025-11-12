import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function HomeTabIcon(props) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M15 21v-8a1 1 0 00-1-1h-4a1 1 0 00-1 1v8"
        stroke={props.stroke || '#657381'}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 10a2 2 0 01.709-1.528l7-5.999a2 2 0 012.582 0l7 5.999A2 2 0 0121 10v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9z"
        stroke={props.stroke || '#657381'}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default HomeTabIcon;
