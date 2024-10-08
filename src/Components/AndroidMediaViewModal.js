import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {Cross, Expand, Collapse} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {RenderIcons} from './index';

const {white, cobaltBlueDark} = colors;

const AndroidMediaViewModal = ({
  source,
  handleVisible,
  isLoading,
  title,
  isVideo,
  coordinates = [],
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleIcon = {
    true: Expand,
    false: Collapse,
  };
  const toggle_Height = {
    true: hp('50%'),
    false: hp('25%'),
  };
  const activeVideoHeight = toggle_Height[isFullScreen];
  const ActiveIcon = toggleIcon[isFullScreen];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={handleVisible}
      style={styles.modalContainer}>
      <View style={styles.centeredView}>
        <TouchableOpacity
          style={styles.crossIconContainer}
          onPress={handleVisible}
          disabled={isLoading}>
          <Cross height={hp('8%')} width={wp('10%')} color={white} />
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
                <ActiveIcon height={hp('5%')} width={wp('5%')} color={white} />
              </TouchableOpacity>
              <VideoPlayer
                video={{uri: source}}
                videoHeight={activeVideoHeight}
                videoWidth={wp('90%')}
                autoplay={true}
                fullScreenOnLongPress={true}
              />
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <FastImage
                source={{uri: source}}
                priority={'normal'}
                resizeMode={'stretch'}
                style={styles.image}
              />
              {coordinates.length > 0 &&
                coordinates.map((marker, index) => (
                  <RenderIcons
                    key={marker.id}
                    marker={marker}
                    index={index}
                    disabled={true}
                  />
                ))}
            </View>
          )}
        </View>
        <View style={styles.container} />
      </View>
      <StatusBar
        backgroundColor={cobaltBlueDark}
        barStyle="light-content"
        translucent={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: wp('80%'),
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cobaltBlueDark,
    paddingTop: hp('7%'),
  },
  image: {
    height: hp('25%'),
    width: wp('80%'),
    alignSelf: 'center',
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
    color: white,
  },
  expandIconContainer: {
    position: 'absolute',
    color: '#fff',
    right: 0,
    zIndex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AndroidMediaViewModal;
