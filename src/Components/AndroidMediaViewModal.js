import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {Cross, Expand, Collapse} from '../Assets/Icons';
import {colors} from '../Assets/Styles';

const AndroidMediaViewModal = ({
  source,
  handleVisible,
  isLoading,
  title,
  isVideo,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  let height = hp('5%');
  let width = wp('5%');
  return (
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
            <View style={styles.image}>
              <TouchableOpacity
                style={styles.expandIconContainer}
                onPress={() => setIsFullScreen(!isFullScreen)}>
                {isFullScreen ? (
                  <Expand height={height} width={width} color={colors.white} />
                ) : (
                  <Collapse
                    height={height}
                    width={width}
                    color={colors.white}
                  />
                )}
              </TouchableOpacity>
              <VideoPlayer
                video={{uri: source}}
                videoHeight={isFullScreen ? hp('50%') : hp('25%')}
                videoWidth={wp('90%')}
                autoplay={true}
                fullScreenOnLongPress={true}
              />
            </View>
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
};

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
  expandIconContainer: {
    position: 'absolute',
    color: '#fff',
    right: 0,
    zIndex: 1,
  },
});
export default AndroidMediaViewModal;
