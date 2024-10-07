import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IMAGES} from '../Assets/Images';

const CompletedInspectionBackgroundImage = ({children}) => (
  <>
    <FastImage
      source={IMAGES.completed_Inspection_Background}
      priority={'normal'}
      resizeMode={'stretch'}
      style={styles.image}
    />
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
      {children}
    </View>
  </>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: hp('75%'),
  },
});
export default CompletedInspectionBackgroundImage;
