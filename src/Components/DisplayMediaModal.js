import React, {useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Video from 'react-native-video';

import {Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {Custom_Image, RenderIcons} from './index';

const {cobaltBlueDark, white} = colors;

const DisplayMediaModal = ({handleVisible, source, title, isVideo, coordinates = []}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={handleVisible} style={styles.container}>
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.crossIconContainer} onPress={handleVisible}>
          <Cross height={hp('8%')} width={wp('10%')} color={white} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={[styles.titleText, styles.textColor]}>{title}</Text>
          {isVideo ? (
            <View style={styles.videoContainer}>
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
        <View style={styles.footerView} />
      </View>
      <StatusBar backgroundColor={cobaltBlueDark} barStyle="light-content" translucent={true} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cobaltBlueDark,
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
  textColor: {
    color: white,
  },
  footerView: {
    flex: 0.4,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    height: hp('40%'),
    width: wp('80%'),
    alignSelf: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loader: {position: 'absolute', alignSelf: 'center'},
});

export default DisplayMediaModal;
