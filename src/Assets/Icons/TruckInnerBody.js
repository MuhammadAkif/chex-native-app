import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function TruckInnerBody(props) {
  return (
    <Svg
      width={184}
      height={296}
      viewBox="0 0 184 296"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect
        x={1}
        y={1}
        width={42}
        height={100}
        rx={7}
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Rect
        x={-1}
        y={1}
        width={42}
        height={100}
        rx={7}
        transform="matrix(-1 0 0 1 182 0)"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Path
        d="M139 48v7H45v-7h94z"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Rect
        x={1}
        y={-1}
        width={42}
        height={100}
        rx={7}
        transform="matrix(1 0 0 -1 0 294)"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Path
        d="M47 43a1 1 0 011 1v15a1 1 0 01-1 1h-4V43h4zM137 43a1 1 0 00-1 1v15a1 1 0 001 1h4V43h-4zM54 46a1 1 0 011 1v9a1 1 0 01-1 1h-6V46h6zM130 46a1 1 0 00-1 1v9a1 1 0 001 1h6V46h-6z"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Rect
        x={183}
        y={295}
        width={42}
        height={100}
        rx={7}
        transform="rotate(180 183 295)"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Path
        d="M139 248v-7H45v7h94z"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Path
        d="M47 253a1 1 0 001-1v-15a1 1 0 00-1-1h-4v17h4zM137 253a1 1 0 01-1-1v-15a1 1 0 011-1h4v17h-4zM54 250a1 1 0 001-1v-9a1 1 0 00-1-1h-6v11h6zM130 250a1 1 0 01-1-1v-9a1 1 0 011-1h6v11h-6zM104 43H81v7.65L87.851 61h9.298L104 50.65V43zM96 233h-7V61h7v172z"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Path
        d="M104 248H81v-7.65L87.851 230h9.298L104 240.35V248zM92 128c3.735 0 7.212 2.118 9.793 5.732 2.58 3.612 4.207 8.654 4.207 14.268 0 5.614-1.627 10.656-4.207 14.268C99.211 165.882 95.735 168 92 168c-3.735 0-7.212-2.118-9.793-5.732C79.627 158.656 78 153.614 78 148c0-5.614 1.627-10.656 4.207-14.268C84.789 130.118 88.265 128 92 128z"
        fill="#fff"
        stroke="#E5E7E7"
        strokeWidth={2}
      />
      <Path stroke="#E5E7E7" strokeWidth={2} d="M89 65L96 65" />
      <Path stroke="#E5E7E7" strokeWidth={2} d="M89 69L96 69" />
      <Path stroke="#E5E7E7" strokeWidth={2} d="M89 73L96 73" />
    </Svg>
  );
}

export default TruckInnerBody;
