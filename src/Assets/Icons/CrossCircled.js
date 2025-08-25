import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function CrossCircledIcon(props) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={9} cy={9} r={9} fill="#D9D9D9" />
      <Path
        d="M12.48 6.252a.547.547 0 10-.774-.773L9 8.185 6.294 5.479a.547.547 0 10-.773.773l2.706 2.706-2.706 2.706a.547.547 0 10.773.773L9 9.731l2.706 2.706a.547.547 0 00.773-.773L9.773 8.958l2.706-2.706z"
        fill="#626161"
      />
    </Svg>
  );
}

export default CrossCircledIcon;
