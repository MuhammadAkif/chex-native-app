import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CalendarIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.176 2.118H7.765V4.94h1.411V2.118zM16.941 2.118H15.53V4.94h1.412V2.118z"
        fill="#505050"
      />
      <Path
        d="M19.059 4.235H5.647c-.78 0-1.412.632-1.412 1.412v12.706c0 .78.632 1.412 1.412 1.412H19.06c.78 0 1.412-.632 1.412-1.412V5.647c0-.78-.633-1.412-1.412-1.412z"
        fill="#505050"
      />
      <Path d="M19.059 8.47H5.647v9.883H19.06V8.47z" fill="#fff" />
      <Path d="M12 9.882H7.059v4.941H12v-4.94z" fill="#505050" />
    </Svg>
  );
}

export default CalendarIcon;
