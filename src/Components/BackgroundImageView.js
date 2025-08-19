import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../Assets/Images';

const BackGroundView = ({children}) => (
  <>
    <FastImage source={IMAGES.sign_In_Background} priority={'normal'} resizeMode={'stretch'} style={styles.image} />
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
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
  },
});
export default BackGroundView;
