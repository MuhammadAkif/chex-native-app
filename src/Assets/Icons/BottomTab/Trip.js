import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function TripTabIcon(props) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M6 22a3 3 0 100-6 3 3 0 000 6z" stroke={props.stroke || '#657381'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M9 19h8.5a3.5 3.5 0 100-7h-11a3.5 3.5 0 110-7H15"
        stroke={props.stroke || '#657381'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M18 8a3 3 0 100-6 3 3 0 000 6z" stroke={props.stroke || '#657381'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default TripTabIcon;
