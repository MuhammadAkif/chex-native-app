import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const {cobaltBlueDark, white, orangePeel} = colors;

const ProgressBar = ({
  progress,
  value = 0,
  maxValue = 100,
  progressValueColor = white,
  activeStrokeColor = orangePeel,
  titleStyle = {},
  containerStyle = {},
  onStartText = 'Downloading...',
  onCompleteText = 'Finalizing Download',
  radius = 30,
  valueSuffix = '%',
  display = true,
}) => {
  if (!display) {
    return null;
  }
  const progressTexts = {
    true: onCompleteText,
    false: onStartText,
  };
  const activeProgressText = progressTexts[progress === 100];

  return (
    <View style={{...styles.container, ...containerStyle}}>
      <CircularProgress
        maxValue={maxValue}
        value={value}
        valueSuffix={valueSuffix}
        radius={radius}
        progressValueColor={progressValueColor}
        activeStrokeColor={activeStrokeColor}
        titleStyle={{...styles.title_Style, ...titleStyle}}
      />
      <Text
        style={{...styles.text, ...styles.title_Style, ...styles.loadingText}}>
        {activeProgressText}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cobaltBlueDark,
    height: '100%',
    width: '100%',
    rowGap: hp('0.5%'),
  },
  loadingText: {
    fontSize: hp('1.5%'),
  },
  text: {
    color: white,
  },
  title_Style: {
    fontWeight: 'bold',
  },
});
export default ProgressBar;
