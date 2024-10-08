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
  ActivityIndicator,
  Keyboard,
  Platform,
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
} from '../index';
import {ANNOTATE_IMAGE, DAMAGE_TYPE, IOS} from '../../Constants';

const {white, gray, royalBlue, lightGray, black} = colors;

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
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [damageDetails, setDamageDetails] = useState([]);
  const [currentMarkerDamageDetails, setCurrentMarkerDamageDetails] =
    useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    const status = isButtonDisabled();
    setCanSubmit(status);
  }, [damageDetails, isLoading]);
  const submitText = isLoading ? (
    <ActivityIndicator size={'small'} color={white} />
  ) : (
    annotateButtonText
  );
  function resetState() {
    setIsFullScreen(false);
    setDamageDetails([]);
    setCurrentMarkerDamageDetails(null);
    setSelectedMarkerId(null);
  }

  const handleDamageDetails = (key, value) => {
    setCurrentMarkerDamageDetails(prevState => {
      const updatedMarker = {
        ...prevState,
        [key]: value,
      };

      setDamageDetails(prevState =>
        prevState.map(item =>
          item.id === selectedMarkerId ? updatedMarker : item,
        ),
      );

      return updatedMarker;
    });
  };

  const addDamageDetails = coordinates => {
    const newMarker = {
      id: damageDetails.length,
      coordinates,
      type: '',
      notes: '',
    };
    setDamageDetails([...damageDetails, newMarker]);
    setCurrentMarkerDamageDetails(newMarker);
    setSelectedMarkerId(newMarker.id);
  };

  const updateDamageDetails = () => {
    if (currentMarkerDamageDetails && selectedMarkerId !== null) {
      setDamageDetails(prevState =>
        prevState.map(item =>
          item.id === selectedMarkerId ? currentMarkerDamageDetails : item,
        ),
      );
    }
  };

  const onImagePress = event => {
    const {locationX, locationY} = event.nativeEvent;
    const coordinates = {x: locationX - wp('5%'), y: locationY - wp('5%')};
    updateDamageDetails();
    addDamageDetails(coordinates);
  };

  const handleExclamationMarkPress = index => {
    updateDamageDetails();
    const selectedMarker = damageDetails[index];
    setCurrentMarkerDamageDetails(selectedMarker);
    setSelectedMarkerId(selectedMarker.id);
  };

  const handleSubmission = () => {
    if (canSubmit || damageDetails?.length < 1) {
      return;
    }
    handleSubmit([...damageDetails], resetState);
  };
  const handleCancelPress = () => {
    resetState();
    handleCancel();
  };
  const isButtonDisabled = () => {
    return damageDetails.some(item => !item.type || !item.notes);
  };
  const removeMarker = id => {
    setDamageDetails(prevState => prevState.filter(marker => marker.id !== id));
    setCurrentMarkerDamageDetails(null);
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
              </Text>
              <FlatList
                data={DAMAGE_TYPE}
                renderItem={({item}) => (
                  <RenderDamageTypes
                    item={item}
                    selectedDamage={currentMarkerDamageDetails?.type}
                    handleDamageDetails={handleDamageDetails}
                    disabled={selectedMarkerId === null}
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
                  style={[styles.text, Platform.OS === IOS && styles.iOSStyle]}
                  placeholder={notes}
                  multiline={true}
                  editable={selectedMarkerId !== null}
                  placeholderTextColor={gray}
                  value={currentMarkerDamageDetails?.notes}
                  onChangeText={text => handleDamageDetails('notes', text)}
                  onBlur={updateDamageDetails}
                />
              </View>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <PrimaryGradientButton
              text={submitText}
              buttonStyle={styles.submitButton}
              onPress={handleSubmission}
              disabled={isLoading}
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
      </TouchableOpacity>
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
    paddingVertical: Platform.OS === IOS ? hp('1%') : hp('0.3%'),
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
