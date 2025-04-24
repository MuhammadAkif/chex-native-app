import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {colors} from '../../Assets/Styles';
import {
  PrimaryGradientButton,
  RenderDamageTypes,
  RenderIcons,
  SecondaryButton,
  Toast,
  Mandatory,
} from '../index';
import {
  ANNOTATE_IMAGE,
  AnnotationAlertMessage,
  DAMAGE_TYPE,
  Platforms,
} from '../../Constants';
import {generateRandomString, isNotEmpty, mergeData} from '../../Utils';
import {resizeInnerBox} from '../../Utils/helpers';
import {useUIActions} from '../../hooks/UI';

const {OS} = Platform;
const {IOS} = Platforms;
const {white, gray, royalBlue, lightGray, black, cobaltBlueMedium} = colors;
const activeButtonColor = {
  true: ['#FF7A00', '#F90'],
  false: [gray, gray],
};
let shouldActiveOpacity = {
  true: 0,
  false: 1,
};

const AnnotateImage = ({
  modalVisible = false,
  handleVisible,
  source = '',
  instructionalSubHeadingText = ANNOTATE_IMAGE.instruction,
  annotateButtonText = ANNOTATE_IMAGE.annotateText,
  cancelButtonText = ANNOTATE_IMAGE.cancelText,
  title = ANNOTATE_IMAGE.title,
  isExterior = true,
  notes = 'Add your notes here',
  handleCancel,
  handleSubmit,
  isLoading = false,
  imageDimensions,
}) => {
  const {toastError} = useUIActions();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [damageDetails, setDamageDetails] = useState([]); // Only coordinates now
  const [damageType, setDamageType] = useState(''); // Shared damage type
  const [damageNotes, setDamageNotes] = useState(''); // Shared notes
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const active_Opacity = shouldActiveOpacity[canSubmit];
  const isButtonActive = activeButtonColor[canSubmit];

  useEffect(() => {
    const status = isButtonDisabled();
    setCanSubmit(status);
  }, [damageType, damageDetails, isLoading]);

  function resetState() {
    setIsFullScreen(false);
    setDamageDetails([]);
    setDamageType('');
    setDamageNotes('');
    setSelectedMarkerId(null);
  }

  const addDamageDetails = coordinates => {
    const id = generateRandomString();
    const newMarker = {
      ...coordinates,
      id,
      width: 10,
      height: 10,
      accuracyMatrix: {
        tp: 1,
        fp: 0,
        fn: 0,
      },
      byAI: false,
      deleted: false,
      isMobile: true,
    };
    setDamageDetails([...damageDetails, newMarker]);
    setSelectedMarkerId(newMarker.id);
  };
  const onImagePress = event => {
    const {locationX, locationY} = event.nativeEvent;
    const {height, width} = imageDimensions;
    const {x, y} = resizeInnerBox(
      height,
      width,
      wp('80%'),
      hp('25%'),
      locationX,
      locationY,
    );
    const coordinates = {
      x,
      y,
      android_x: locationX - wp('5%'),
      android_y: locationY - wp('5%'),
      mobileHeight: hp('25%'),
      mobileWidth: wp('80%'),
      originalHeight: height,
      originalWidth: width,
    };
    addDamageDetails(coordinates);
  };

  const handleExclamationMarkPress = index => {
    const selectedMarker = damageDetails[index];
    setSelectedMarkerId(selectedMarker.id);
  };
  const handleSubmission = () => {
    if (!canSubmit) {
      toastError(AnnotationAlertMessage);
      return;
    }
    const label = damageType;
    const coordinateArray = mergeData(damageDetails, label);
    const submissionData = {
      coordinateArray, // coordinates for each icon
      label,
      notes: damageNotes,
    };
    handleSubmit(submissionData, resetState);
  };
  const handleCancelPress = () => {
    resetState();
    handleCancel();
  };
  const isButtonDisabled = () => {
    return isNotEmpty(damageType) && damageDetails.length > 0;
  };
  const removeMarker = id => {
    setDamageDetails(prevState => prevState.filter(marker => marker.id !== id));
    setSelectedMarkerId(null);
  };
  const closeKeyboard = () => Keyboard.dismiss();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleVisible}
      style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.centeredViewContainer}
        onPress={closeKeyboard}>
        <KeyboardAvoidingView behavior={'padding'}>
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
                <Mandatory style={styles.titleText} />
              </Text>
              <TouchableOpacity
                onPress={onImagePress}
                activeOpacity={1}
                disabled={isLoading}>
                <FastImage
                  source={{uri: source}}
                  priority={'normal'}
                  resizeMode={'stretch'}
                  style={[styles.image, {height: hp('25%')}]}
                />
                {damageDetails?.length > 0 &&
                  damageDetails.map((marker, index) => {
                    return (
                      <RenderIcons
                        key={marker.id}
                        marker={marker}
                        handleExclamationMarkPress={() =>
                          handleExclamationMarkPress(index)
                        }
                        selectedMarkerId={selectedMarkerId}
                        onCrossPressed={() => removeMarker(marker.id)}
                      />
                    );
                  })}
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={[styles.box, {height: hp('9%'), width: '90%'}]}>
                <Text style={styles.subHeadingText}>
                  Identify Damage Severity Level
                  <Mandatory style={styles.subHeadingText} />
                </Text>
                <FlatList
                  data={DAMAGE_TYPE}
                  renderItem={({item}) => (
                    <RenderDamageTypes
                      item={item}
                      selectedDamage={damageType}
                      handleDamageDetails={(key, value) => setDamageType(value)}
                    />
                  )}
                  keyExtractor={item => item}
                  horizontal={true}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.subHeadingText}>Add Notes</Text>
                <View style={styles.statusDescriptionContainer}>
                  <TextInput
                    style={[styles.text, OS === IOS && styles.iOSStyle]}
                    placeholder={notes}
                    multiline={true}
                    placeholderTextColor={gray}
                    value={damageNotes}
                    onChangeText={text => setDamageNotes(text)}
                  />
                </View>
              </View>
            </View>
            <View style={styles.footerContainer}>
              <PrimaryGradientButton
                text={annotateButtonText}
                buttonStyle={styles.submitButton}
                onPress={handleSubmission}
                disabled={isLoading}
                colors={isButtonActive}
                activeOpacity={active_Opacity}
              />
              <SecondaryButton
                text={cancelButtonText}
                buttonStyle={styles.cancelButton}
                textStyle={styles.cancelButtonText}
                onPress={handleCancelPress}
                disabled={isLoading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
      <StatusBar
        backgroundColor={cobaltBlueMedium}
        barStyle="light-content"
        translucent={true}
      />
      <Toast isModal={true} />
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
    backgroundColor: cobaltBlueMedium,
    paddingTop: hp('7%'),
  },
  centeredView: {
    height: hp('80%'),
    width: wp('90%'),
    borderRadius: hp('1%'),
    backgroundColor: white,
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
    color: royalBlue,
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
    color: royalBlue,
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
  image: {
    width: wp('80%'),
    borderRadius: 10,
  },
  textColor: {
    color: white,
  },
  instructionsAndSubHeadingContainer: {
    alignItems: 'center',
    rowGap: hp('2%'),
  },
  footerContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  bold: {
    fontWeight: '600',
  },
  submitButton: {
    width: wp('40%'),
    borderRadius: hp('10%'),
  },
  cancelButton: {
    width: wp('40%'),
    borderRadius: hp('10%'),
    borderColor: royalBlue,
  },
  cancelButtonText: {
    color: royalBlue,
  },
  statusDescriptionContainer: {
    height: hp('12%'),
    width: '100%',
    paddingVertical: OS === IOS ? hp('1%') : hp('0.3%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 10,
    backgroundColor: lightGray,
  },
  text: {
    fontSize: hp('1.8%'),
    color: black,
    width: '100%',
  },
  iOSStyle: {
    height: hp('10%'),
  },
  box: {
    rowGap: hp('1%'),
    width: '90%',
  },
});

export default AnnotateImage;
