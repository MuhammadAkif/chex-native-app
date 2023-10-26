import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');

const circleArray = Array.from({length: width / 1.3});
const VectorDesign = () => (
  <View style={styles.container}>
    <View style={styles.gradientView} />
    <View style={styles.circleContainer}>
      {circleArray.map(() => (
        <View style={styles.circle} />
      ))}
    </View>
  </View>
);

// Later on in your styles..
const styles = StyleSheet.create({
  container: {
    // height: hp('35%'),
    flex: 1,
    backgroundColor: 'hsla(209 ,12%, 11%, 100)',
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 0,
  },
  text: {
    color: '#ffffff',
  },
  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('100%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  circle: {
    height: 15,
    width: 15,
    borderRadius: 15,
    borderWidth: 3,
    margin: 3,
    backgroundColor: '#B8BFD2',
  },
  gradientView: {
    height: hp('100%'),
    width: wp('100%'),
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    // backgroundColor: 'rgba(0, 27, 81, 0.8)',
  },
});
export default VectorDesign;
