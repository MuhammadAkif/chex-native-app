import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function CircleTickIcon(props) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <G clipPath="url(#clip0_9073_19175)" stroke="#20C18D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 16.5c4.125 0 7.5-3.375 7.5-7.5S13.125 1.5 9 1.5 1.5 4.875 1.5 9s3.375 7.5 7.5 7.5z" />
        <Path d="M5.813 9l2.122 2.122 4.253-4.245" />
      </G>
      <Defs>
        <ClipPath id="clip0_9073_19175">
          <Path fill="#fff" d="M0 0H18V18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default CircleTickIcon;
