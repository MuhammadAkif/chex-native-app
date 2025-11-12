import * as React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

function BellWhiteIcon(props) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M24.26 19.243c-.607-1.045-1.51-4.004-1.51-7.868a8.75 8.75 0 00-17.5 0c0 3.865-.903 6.823-1.51 7.868a1.75 1.75 0 001.51 2.632h4.464a4.375 4.375 0 008.573 0h4.464a1.75 1.75 0 001.51-2.632zM14 23.625a2.625 2.625 0 01-2.473-1.75h4.948A2.625 2.625 0 0114 23.625zm-8.75-3.5C6.094 18.677 7 15.321 7 11.375a7 7 0 1114 0c0 3.943.906 7.299 1.75 8.75H5.25z"
        fill="#fff"
      />
      <Circle cx={22} cy={5} r={4} fill="#FA3636" />
    </Svg>
  );
}

export default BellWhiteIcon;
