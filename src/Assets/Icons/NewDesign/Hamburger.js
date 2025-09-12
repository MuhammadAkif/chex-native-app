import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function HamburgerIcon(props) {
  return (
    <Svg width={20} height={15} viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M1 1h18M1 7h12M1 14h5" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default HamburgerIcon;
