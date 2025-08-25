import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {Cross, Expand, Collapse} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {Custom_Image, RenderIcons} from './index';

const {white, cobaltBlueDark} = colors;

const AndroidMediaViewModal = ({source, handleVisible, title, isVideo, coordinates = []}) => {
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const toggleIcon = {
  //   true: Expand,
  //   false: Collapse,
  // };
  // const toggle_Height = {
  //   true: hp('50%'),
  //   false: hp('25%'),
  // };
  // const activeVideoHeight = toggle_Height[isFullScreen];
  // const ActiveIcon = toggleIcon[isFullScreen];

  return (
    <Modal statusBarTranslucent animationType="slide" transparent={true} visible={true} onRequestClose={handleVisible} style={styles.modalContainer}>
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.crossIconContainer} onPress={handleVisible}>
          <Cross height={hp('8%')} width={wp('10%')} color={white} />
        </TouchableOpacity>
        <View style={[styles.container, styles.headerContainer]}>
          <Text style={[styles.titleText, styles.textColor]}>{title}</Text>
        </View>
        <View style={styles.container}>
          {isVideo ? (
            <View style={styles.videoContainer}>
              {/* <TouchableOpacity style={styles.expandIconContainer} onPress={() => setIsFullScreen(!isFullScreen)}>
                <ActiveIcon height={hp('5%')} width={wp('5%')} color={white} />
              </TouchableOpacity> */}
              <ActivityIndicator color={colors.royalBlue} size={'large'} animating={isLoading} style={styles.loader} />

              <Video
                source={{uri: source}}
                autoplay
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                style={{width: '100%', height: '100%'}}
                controls
                resizeMode="contain"
                controlsStyles={{hideForward: true, hideNext: true, hidePrevious: true, hideRewind: true, hidePlayPause: true}}
              />
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Custom_Image source={{uri: source}} imageStyle={styles.image} />
              {coordinates.length > 0 &&
                coordinates.map((marker, index) => <RenderIcons key={marker.id} marker={marker} index={index} disabled={true} />)}
            </View>
          )}
        </View>
        <View style={styles.container} />
      </View>
      <StatusBar backgroundColor={cobaltBlueDark} barStyle="light-content" translucent={true} />
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
  videoContainer: {
    height: hp('40%'),
    width: wp('80%'),
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIconContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight + 15,
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
  loader: {position: 'absolute', alignSelf: 'center'},
});
export default AndroidMediaViewModal;
