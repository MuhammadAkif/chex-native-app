import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CircularProgress from 'react-native-circular-progress-indicator';

import {Platforms} from '../Constants';
import {colors} from '../Assets/Styles';

const {OS} = Platform;
const {ANDROID} = Platforms;
const {orangePeel, white} = colors;
const {loadingTexts} = {true: 'Finalizing Upload', false: 'Uploading'};
const platformRadius = {true: 40, false: 80};
const progressContainerTop = {true: hp('8%'), false: null};

const ProgressCircle = ({
  valueSuffix = '%',
  isFullScreen = false,
  progress = 0,
}) => {
  const androidFullScreen = OS === ANDROID && isFullScreen;
  const loadingText = loadingTexts[progress === 100];
  const radius = platformRadius[androidFullScreen];
  const top = progressContainerTop[androidFullScreen];
  const containerStyle = {
    ...styles.body,
    justifyContent: 'center',
    top: top,
  };

  return (
    <View style={containerStyle}>
      <CircularProgress
        maxValue={100}
        value={progress}
        valueSuffix={valueSuffix}
        radius={radius}
        progressValueColor={white}
        activeStrokeColor={orangePeel}
        titleStyle={styles.titleStyle}
      />
      <Text style={styles.loadingText}>{loadingText}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: wp('90%'),
    borderRadius: 10,
  },
  loadingText: {
    fontSize: hp('1.8%'),
    paddingTop: hp('1%'),
    color: white,
  },
  titleStyle: {
    fontWeight: 'bold',
  },
});

export default ProgressCircle;
