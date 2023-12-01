import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import Cross from '../Assets/Icons/Cross';
import {colors} from '../Assets/Styles';

const DisplayMediaModal = ({handleVisible, source, title, isVideo}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    style={styles.container}>
    <View style={styles.centeredView}>
      <TouchableOpacity
        style={styles.crossIconContainer}
        onPress={handleVisible}>
        <Cross height={hp('8%')} width={wp('10%')} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={[styles.titleText, styles.textColor]}>{title}</Text>
        {isVideo ? (
          <Video
            source={{uri: source}}
            controls={true}
            playInBackground={false}
            style={styles.image}
          />
        ) : (
          <FastImage
            source={{uri: source}}
            priority={'normal'}
            resizeMode={'stretch'}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.footerView} />
    </View>
    <StatusBar hidden={true} />
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    paddingTop: hp('7%'),
  },
  header: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  titleText: {
    fontSize: hp('3%'),
    fontWeight: '600',
  },
  image: {
    height: hp('25%'),
    width: wp('90%'),
    borderRadius: 10,
  },
  crossIconContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  textColor: {
    color: colors.white,
  },
  footerView: {
    flex: 0.4,
  },
});

export default DisplayMediaModal;