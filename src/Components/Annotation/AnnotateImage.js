import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {colors} from '../../Assets/Styles';
import {PrimaryGradientButton, RenderDamageTypes} from '../index';
import {ANNOTATE_IMAGE, DAMAGE_TYPE} from '../../Constants';

const {
  title: Title,
  annotateText,
  instruction,
  source: imagePath,
} = ANNOTATE_IMAGE;

const damageDetailsInitialState = {
  coordinates: {
    x: 0,
    y: 0,
  },
  type: '',
  notes: '',
};

const AnnotateImage = ({
  modalVisible,
  handleVisible,
  handleCaptureImage,
  source = imagePath,
  instructionalSubHeadingText = instruction,
  annotateButtonText = annotateText,
  title = Title,
  isVideo = false,
  modalKey,
  isCarVerification = false,
  isExterior = true,
  notes = 'Add your notes here',
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [damageDetails, setDamageDetails] = useState(damageDetailsInitialState);
  console.log({damageDetails});
  const handleDamageDetails = (key, value) => {
    console.log({key, value});
    setDamageDetails(prevState => ({...prevState, [key]: value}));
  };

  const imageHeight = {
    true: hp('15%'),
    false: hp('25%'),
  };

  function handleSubmit() {
    console.log('Submitting details: ', {damageDetails});
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleVisible}
      style={styles.container}>
      <View style={styles.centeredViewContainer}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.header,
              {
                flex: instructionalSubHeadingText ? 1.5 : 1,
                flexGrow: isExterior ? 2 : 1,
              },
            ]}>
            <Text
              style={[
                styles.titleText,
                {bottom: isFullScreen ? hp('3%') : null},
              ]}>
              {title}
            </Text>
            <FastImage
              source={source}
              priority={'normal'}
              resizeMode={'stretch'}
              style={[styles.image, {height: imageHeight[isCarVerification]}]}
            />
          </View>
          <View style={styles.body}>
            <View style={[styles.box, {height: hp('9%'), width: '90%'}]}>
              <Text style={styles.subHeadingText}>
                Identify Damage Severity Level
              </Text>
              <View>
                <FlatList
                  data={DAMAGE_TYPE}
                  renderItem={({item}) => (
                    <RenderDamageTypes
                      item={item}
                      selectedDamage={damageDetails.type}
                      handleDamageDetails={handleDamageDetails}
                    />
                  )}
                  key={({item}) => item}
                  horizontal={true}
                />
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.subHeadingText}>Add Notes</Text>
              <View style={styles.statusDescriptionContainer}>
                <TextInput
                  style={styles.text}
                  placeholder={notes}
                  multiline={true}
                  onChangeText={text => handleDamageDetails('notes', text)}
                />
              </View>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <PrimaryGradientButton
              text={annotateButtonText}
              buttonStyle={styles.submitButton}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
      <StatusBar
        backgroundColor="rgba(0, 27, 81, 0.9)"
        barStyle="light-content"
        translucent={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    paddingTop: hp('7%'),
  },
  centeredView: {
    height: hp('80%'),
    width: wp('90%'),
    borderRadius: hp('1%'),
    backgroundColor: colors.white,
  },
  header: {
    flex: 1,
    width: wp('90%'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  titleText: {
    fontSize: hp('3%'),
    fontWeight: '600',
    color: colors.royalBlue,
  },
  subHeadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: wp('80%'),
    paddingLeft: 20,
  },
  body: {
    flex: 2,
    width: wp('90%'),
    alignItems: 'center',
    rowGap: hp('2%'),
  },
  subHeadingText: {
    color: colors.royalBlue,
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
  image: {
    width: wp('80%'),
    borderRadius: 10,
  },
  textColor: {
    color: colors.white,
  },
  instructionsAndSubHeadingContainer: {
    alignItems: 'center',
    rowGap: hp('2%'),
  },
  footerContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: {
    fontWeight: '600',
  },
  submitButton: {
    width: wp('50%'),
    borderRadius: hp('10%'),
  },
  statusDescriptionContainer: {
    height: hp('12%'),
    width: '100%',
    padding: '3%',
    borderRadius: 10,
    backgroundColor: colors.lightGray,
  },
  text: {
    fontSize: hp('1.8%'),
    color: colors.black,
    width: '100%',
    height: hp('10%'),
  },
  box: {
    rowGap: hp('1%'),
    width: '90%',
  },
});

export default AnnotateImage;
