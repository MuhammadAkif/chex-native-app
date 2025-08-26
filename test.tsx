import {View, Text} from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import {colors} from './src/Assets/Styles';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const Test = () => {
  return (
    <View>
      <Progress.Circle
        borderColor={colors.orangePeel}
        strokeCap="round"
        animated={true}
        color={colors.orangePeel}
        unfilledColor={colors.gray}
        size={widthPercentageToDP('35%')}
        borderWidth={0}
        thickness={10}
        // maxValue={100}
        progress={0.2}
        showsText
        formatText={() => '100%'}
        textStyle={{fontWeight: 'bold', color: colors.black}}
      />
    </View>
  );
};

export default Test;
