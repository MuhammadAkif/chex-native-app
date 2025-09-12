import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function BlueTruckStatIcon(props) {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect width={36} height={36} rx={8} fill="#0080FF" fillOpacity={0.1} />
      <Path
        d="M19.666 23V13a1.667 1.667 0 00-1.667-1.666h-6.666A1.666 1.666 0 009.666 13v9.167a.833.833 0 00.833.833h1.667M20.5 23h-5M23.833 23h1.666a.834.834 0 00.834-.834v-3.041a.833.833 0 00-.184-.52l-2.9-3.625a.832.832 0 00-.65-.314h-2.933"
        stroke="#0080FF"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.167 24.667a1.667 1.667 0 100-3.334 1.667 1.667 0 000 3.334zM13.833 24.667a1.667 1.667 0 100-3.333 1.667 1.667 0 000 3.333z"
        stroke="#0080FF"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BlueTruckStatIcon;
