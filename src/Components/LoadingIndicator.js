import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../Assets/Styles';

const {white, cobaltBlueLight} = colors;

const LoadingIndicator = ({isLoading}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: wp(100),
    height: hp(100),
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.5)',
  },

  loaderBox: {
    padding: hp('2%'),
    borderRadius: 10,
    // optional background if you want a card-like loader
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default LoadingIndicator;
