import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CameraOutlineIcon(props) {
  return (
    <Svg width={20} height={18} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M10.112 12.556a2.667 2.667 0 100-5.334 2.667 2.667 0 000 5.333z" stroke="#1467B8" strokeWidth={1.5} />
      <Path
        d="M1.223 10.212c0-2.724 0-4.086.665-5.064a3.915 3.915 0 011.09-1.07c.64-.42 1.442-.57 2.67-.624a1.25 1.25 0 001.204-1A1.835 1.835 0 018.66 1h2.905c.878 0 1.635.609 1.807 1.455.115.563.619 1 1.205 1 1.227.053 2.028.203 2.669.623.431.283.802.647 1.09 1.07.665.978.665 2.34.665 5.064s0 4.086-.665 5.064a3.92 3.92 0 01-1.09 1.07C16.248 17 14.86 17 12.087 17h-3.95c-2.775 0-4.162 0-5.159-.654a3.917 3.917 0 01-1.09-1.07 3.05 3.05 0 01-.42-.943M16.334 7.222h-.889"
        stroke="#1467B8"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default CameraOutlineIcon;
