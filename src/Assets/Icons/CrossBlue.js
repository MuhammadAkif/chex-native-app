import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function CrossBlue(props) {
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={9.69922} cy={9.36914} r={9} fill="#1467B8" />
      <Path
        d="M6.611 5.185l3.088 3.088L12.771 5.2a.736.736 0 01.528-.232.8.8 0 01.747 1.086.722.722 0 01-.163.242l-3.112 3.072 3.112 3.112a.72.72 0 01.216.488.8.8 0 01-.8.8.736.736 0 01-.552-.216l-3.048-3.088-3.08 3.08a.737.737 0 01-.52.224.8.8 0 01-.747-1.087.72.72 0 01.163-.241l3.112-3.072-3.112-3.112a.72.72 0 01-.216-.488.8.8 0 01.8-.8c.192.002.376.08.512.216z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CrossBlue;
