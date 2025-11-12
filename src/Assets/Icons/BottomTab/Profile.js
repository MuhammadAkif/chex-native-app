import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ProfileTabIcon(props) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M4 18a4 4 0 014-4h8a4 4 0 014 4 2 2 0 01-2 2H6a2 2 0 01-2-2z"
        stroke={props.stroke || '#657381'}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path d="M12 10a3 3 0 100-6 3 3 0 000 6z" stroke={props.stroke || '#657381'} strokeWidth={1.5} />
    </Svg>
  );
}

export default ProfileTabIcon;
