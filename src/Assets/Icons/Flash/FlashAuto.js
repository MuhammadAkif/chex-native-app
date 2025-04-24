import * as React from 'react';
import {Text} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Styles';
import {TouchableButton} from '../../../Components';

const FlashAuto = ({
  height = hp('5%'),
  width = wp('5%'),
  color = colors.white,
  onPress,
}) => (
  <TouchableButton style={{flexDirection: 'row'}} onPress={onPress}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      viewBox="0 0 448 512">
      <Path
        d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288h111.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5z"
        fill={color}
      />
    </Svg>
    <Text
      style={{
        fontWeight: 'bold',
        zIndex: 1,
        fontSize: hp('1.5%'),
        color: colors.white,
        bottom: -wp('0.9%'),
        right: 0,
        position: 'absolute',
      }}>
      A
    </Text>
  </TouchableButton>
);

export default FlashAuto;
