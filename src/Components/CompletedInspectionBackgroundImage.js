import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const CompletedInspectionBackgroundImage = ({children}) => (
  <>
    <FastImage
      source={require('../Assets/Images/CompletedInspection.jpg')}
      priority={'normal'}
      resizeMode={'stretch'}
      style={styles.image}
    />
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
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
