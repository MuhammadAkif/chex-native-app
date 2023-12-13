import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import FastImage from 'react-native-fast-image';

const AndroidMediaViewModal = ({
  source,
  handleVisible,
  isLoading,
  title,
  isVideo,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    style={styles.modalContainer}>
    <View style={styles.centeredView}>
      <TouchableOpacity
        style={styles.crossIconContainer}
        onPress={handleVisible}
        disabled={isLoading}>
        <Cross height={hp('8%')} width={wp('10%')} color={colors.white} />
      </TouchableOpacity>
      <View style={[styles.container, styles.headerContainer]}>
        <Text style={[styles.titleText, styles.textColor]}>{title}</Text>
      </View>
      <View style={styles.container}>
        {isVideo ? (
          <VideoPlayer
            source={{uri: source}}
            playInBackground={false}
            tapAnywhereToPause={true}
            disableBack={true}
            videoStyle={styles.image}
            repeat={false}
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
      <View style={styles.container} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: wp('90%'),
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    paddingTop: hp('7%'),
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  crossIconContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  titleText: {
    fontSize: hp('3%'),
    fontWeight: '600',
    color: colors.white,
  },
});
export default AndroidMediaViewModal;
