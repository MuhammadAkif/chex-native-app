import React, {useRef, useCallback} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import Video from 'react-native-video';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../Assets/Styles';

const INSPECTION_DEMO_VIDEO = require('../Assets/Videos/InspectionDemo.mp4');

/**
 * InspectionTourVideoModal - Full-screen modal for playing inspection tutorial video
 *
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onComplete - Called when video ends or user skips
 */
const InspectionTourVideoModal = ({visible, onComplete}) => {
  const videoRef = useRef(null);

  const handleSkip = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const handleVideoEnd = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const handleError = useCallback(
    error => {
      console.warn('Tour video playback error:', error);
      // If video fails to load, allow user to continue
      onComplete?.();
    },
    [onComplete]
  );

  if (!visible) return null;

  return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={visible}
        onRequestClose={handleSkip}
        statusBarTranslucent
        navigationBarTranslucent>
        <View style={styles.container}>
          <StatusBar backgroundColor={colors.cobaltBlueDark} barStyle="light-content" translucent />

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          {/* Video Player */}
          <Video
            ref={videoRef}
            source={INSPECTION_DEMO_VIDEO}
            style={styles.video}
            resizeMode="contain"
            onEnd={handleVideoEnd}
            onError={handleError}
            controls={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
            repeat={false}
          />

          {/* Bottom Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Inspection Guide</Text>
            <Text style={styles.infoText}>
              Learn how to capture inspection images correctly and what angles to use for best results.
            </Text>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cobaltBlueDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: hp('6%'),
    right: wp('5%'),
    zIndex: 10,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  skipButtonText: {
    color: colors.white,
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
  video: {
    width: wp('100%'),
    height: hp('60%'),
  },
  infoContainer: {
    position: 'absolute',
    bottom: hp('8%'),
    paddingHorizontal: wp('8%'),
    alignItems: 'center',
  },
  infoTitle: {
    color: colors.white,
    fontSize: hp('2.5%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: hp('1.6%'),
    textAlign: 'center',
    lineHeight: hp('2.4%'),
  },
});

export default InspectionTourVideoModal;
