import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {PrimaryGradientButton} from './index';
import {colors} from '../Assets/Styles';

const {white, red} = colors;

const WarningModal = ({onPress}) => (
  <View style={styles.container}>
    <View style={styles.modalContainer}>
      <Text style={styles.header}>Discrepancy Detected</Text>
      <Text style={styles.body}>
        Mismatch in License Plate Number detected. Please retake the photo of
        the license plate of the vehicle selected
      </Text>
      <View style={styles.footer}>
        <PrimaryGradientButton
          text={'OK'}
          buttonStyle={styles.button}
          onPress={onPress}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    padding: 10,
  },
  header: {
    fontSize: hp('2%'),
    color: red,
    fontWeight: 'bold',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  body: {
    fontSize: hp('1.7%'),
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    height: hp('5%'),
    width: wp('40%'),
  },
});

export default WarningModal;
