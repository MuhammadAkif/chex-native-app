import * as React from 'react';
import Svg, {G, Circle, Defs, LinearGradient, Stop, Path} from 'react-native-svg';

function GradientCircleTabIcon(props) {
  return (
    <Svg width={104} height={104} viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <G>
        {/* Outer gradient circle */}
        <Circle cx={52} cy={44} r={32} fill="url(#paint0_linear_8918_932)" />
        <Circle cx={52} cy={44} r={30} stroke="#fff" strokeOpacity={0.7} strokeWidth={4} />

        {/* Plus sign in the middle */}
        {/* Horizontal line */}
        <Path d="M42 44h20" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
        {/* Vertical line */}
        <Path d="M52 34v20" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </G>
      <Defs>
        <LinearGradient id="paint0_linear_8918_932" x1={20} y1={44} x2={80.6316} y2={44} gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF7A00" />
          <Stop offset={1} stopColor="#F90" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default GradientCircleTabIcon;
