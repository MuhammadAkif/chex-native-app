import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function SubmittedStatIcon(props) {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect width={36} height={36} rx={8} fill="#16A249" fillOpacity={0.1} />
      <Path
        d="M20.5 9.666h-5a.833.833 0 00-.834.834v1.666c0 .46.373.834.833.834h5c.46 0 .834-.373.834-.834V10.5a.833.833 0 00-.834-.834z"
        stroke="#16A249"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.334 11.334h1.667A1.667 1.667 0 0124.667 13v11.667a1.667 1.667 0 01-1.666 1.666H13a1.667 1.667 0 01-1.667-1.666V13a1.667 1.667 0 011.667-1.666h1.666"
        stroke="#16A249"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M15.5 19.667l1.667 1.666L20.5 18" stroke="#16A249" strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default SubmittedStatIcon;
