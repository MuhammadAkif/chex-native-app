import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
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
import {ANNOTATE_IMAGE, DAMAGE_TYPE} from '../../Constants';

const AnnotateImage = ({
  modalVisible,
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
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [damageDetails, setDamageDetails] = useState([]);
  const [currentMarkerDamageDetails, setCurrentMarkerDamageDetails] =
    useState(null); // Track currently selected marker for editing
  const [selectedMarkerId, setSelectedMarkerId] = useState(null); // Track the current marker's ID

  function resetState() {
    setIsFullScreen(false);
    setDamageDetails([]);
    setCurrentMarkerDamageDetails(null);
    setSelectedMarkerId(null);
  }

  const handleDamageDetails = (key, value) => {
    // Update current marker's details
    setCurrentMarkerDamageDetails(prevState => {
      const updatedMarker = {
        ...prevState,
        [key]: value,
      };

      // Update damageDetails array with the updated marker
      setDamageDetails(prevState =>
        prevState.map(item =>
          item.id === selectedMarkerId ? updatedMarker : item,
        ),
      );

      return updatedMarker; // Also return the updated marker to update the current state
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
    setCurrentMarkerDamageDetails(newMarker); // Select this new marker for editing
    setSelectedMarkerId(newMarker.id); // Set selected marker ID
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
    const coordinates = {x: locationX, y: locationY};
    updateDamageDetails(); // Save any existing marker changes before adding a new one
    addDamageDetails(coordinates); // Add new marker
  };

  const handleExclamationMarkPress = index => {
    updateDamageDetails(); // Save current marker changes before switching
    const selectedMarker = damageDetails[index];
    setCurrentMarkerDamageDetails(selectedMarker); // Load the clicked marker's details for editing
    setSelectedMarkerId(selectedMarker.id); // Track the clicked marker's ID
  };

  const handleSubmission = () => {
    handleSubmit([...damageDetails]);
    resetState();
  };
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
            <TouchableOpacity onPress={onImagePress} activeOpacity={1}>
              <FastImage
                source={{uri: source}}
                priority={'normal'}
                resizeMode={'stretch'}
                style={[styles.image, {height: hp('25%')}]}
              />
              {damageDetails.length > 0 &&
                damageDetails.map((marker, index) => (
                  <RenderIcons
                    key={marker.id}
                    marker={marker}
                    index={index}
                    handleExclamationMarkPress={() =>
                      handleExclamationMarkPress(index)
                    }
                  />
                ))}
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
                  style={styles.text}
                  placeholder={notes}
                  multiline={true}
                  placeholderTextColor={colors.gray}
                  value={currentMarkerDamageDetails?.notes}
                  onChangeText={text => handleDamageDetails('notes', text)}
                  onBlur={updateDamageDetails} // Save changes when losing focus
                />
              </View>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <PrimaryGradientButton
              text={annotateButtonText}
              buttonStyle={styles.submitButton}
              onPress={handleSubmission}
            />
            <SecondaryButton
              text={cancelButtonText}
              buttonStyle={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              onPress={handleCancel}
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
    borderColor: colors.royalBlue,
  },
  cancelButtonText: {
    color: colors.royalBlue,
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

// import React, {useState} from 'react';
// import {
//   Modal,
//   StyleSheet,
//   View,
//   Text,
//   StatusBar,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import FastImage from 'react-native-fast-image';
//
// import {colors} from '../../Assets/Styles';
// import {PrimaryGradientButton, RenderDamageTypes} from '../index';
// import {ANNOTATE_IMAGE, DAMAGE_TYPE} from '../../Constants';
// import {Exclamation} from '../../Assets/Icons';
//
// const {
//   title: Title,
//   annotateText,
//   instruction,
//   source: imagePath,
// } = ANNOTATE_IMAGE;
//
// const damageDetailsInitialState = [
//   {
//     id: 0,
//     coordinates: {
//       x: null,
//       y: null,
//     },
//     type: '',
//     notes: '',
//   },
// ];
// const imageHeight = {
//   true: hp('15%'),
//   false: hp('25%'),
// };
//
// const AnnotateImage = ({
//   modalVisible,
//   handleVisible,
//   source = imagePath,
//   instructionalSubHeadingText = instruction,
//   annotateButtonText = annotateText,
//   title = Title,
//   isCarVerification = false,
//   isExterior = true,
//   notes = 'Add your notes here',
// }) => {
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [damageDetails, setDamageDetails] = useState(damageDetailsInitialState);
//   console.log({damageDetails});
//   const handleDamageDetails = (key, value) => {
//     setDamageDetails(prevState => ({...prevState, [key]: value}));
//   };
//
//   function handleSubmit() {
//     console.log('Submitting details: ', {damageDetails});
//   }
//   function onImagePress(event) {
//     const {locationX, locationY} = event.nativeEvent;
//     const coordinates = {x: locationX, y: locationY};
//     handleDamageDetails('coordinates', coordinates);
//   }
//   function handleExclamationMarkPress() {
//     console.log('I was touched');
//   }
//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={handleVisible}
//       style={styles.container}>
//       <View style={styles.centeredViewContainer}>
//         <View style={styles.centeredView}>
//           <View
//             style={[
//               styles.header,
//               {
//                 flex: instructionalSubHeadingText ? 1.5 : 1,
//                 flexGrow: isExterior ? 2 : 1,
//               },
//             ]}>
//             <Text
//               style={[
//                 styles.titleText,
//                 {bottom: isFullScreen ? hp('3%') : null},
//               ]}>
//               {title}
//             </Text>
//             <TouchableOpacity onPress={onImagePress} activeOpacity={1}>
//               <FastImage
//                 source={source}
//                 priority={'normal'}
//                 resizeMode={'stretch'}
//                 style={[styles.image, {height: imageHeight[isCarVerification]}]}
//               />
//               {damageDetails?.coordinates?.y !== null && (
//                 <TouchableOpacity
//                   style={{
//                     position: 'absolute',
//                     zIndex: 1,
//                     top: damageDetails?.coordinates?.y,
//                     left: damageDetails?.coordinates?.x,
//                   }}
//                   onPress={handleExclamationMarkPress}>
//                   <Exclamation height={hp('3%')} width={wp('6%')} />
//                 </TouchableOpacity>
//               )}
//             </TouchableOpacity>
//           </View>
//           <View style={styles.body}>
//             <View style={[styles.box, {height: hp('9%'), width: '90%'}]}>
//               <Text style={styles.subHeadingText}>
//                 Identify Damage Severity Level
//               </Text>
//               <View>
//                 <FlatList
//                   data={DAMAGE_TYPE}
//                   renderItem={({item}) => (
//                     <RenderDamageTypes
//                       item={item}
//                       selectedDamage={damageDetails.type}
//                       handleDamageDetails={handleDamageDetails}
//                     />
//                   )}
//                   key={({item}) => item}
//                   horizontal={true}
//                 />
//               </View>
//             </View>
//             <View style={styles.box}>
//               <Text style={styles.subHeadingText}>Add Notes</Text>
//               <View style={styles.statusDescriptionContainer}>
//                 <TextInput
//                   style={styles.text}
//                   placeholder={notes}
//                   multiline={true}
//                   value={damageDetails.notes}
//                   onChangeText={text => handleDamageDetails('notes', text)}
//                 />
//               </View>
//             </View>
//           </View>
//           <View style={styles.footerContainer}>
//             <PrimaryGradientButton
//               text={annotateButtonText}
//               buttonStyle={styles.submitButton}
//               onPress={handleSubmit}
//             />
//           </View>
//         </View>
//       </View>
//       <StatusBar
//         backgroundColor="rgba(0, 27, 81, 0.9)"
//         barStyle="light-content"
//         translucent={true}
//       />
//     </Modal>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   centeredViewContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 27, 81, 0.9)',
//     paddingTop: hp('7%'),
//   },
//   centeredView: {
//     height: hp('80%'),
//     width: wp('90%'),
//     borderRadius: hp('1%'),
//     backgroundColor: colors.white,
//   },
//   header: {
//     flex: 1,
//     width: wp('90%'),
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: hp('3%'),
//     fontWeight: '600',
//     color: colors.royalBlue,
//   },
//   subHeadingContainer: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     width: wp('80%'),
//     paddingLeft: 20,
//   },
//   body: {
//     flex: 2,
//     width: wp('90%'),
//     alignItems: 'center',
//     rowGap: hp('2%'),
//   },
//   subHeadingText: {
//     color: colors.royalBlue,
//     fontSize: hp('1.8%'),
//     fontWeight: '600',
//   },
//   image: {
//     width: wp('80%'),
//     borderRadius: 10,
//   },
//   textColor: {
//     color: colors.white,
//   },
//   instructionsAndSubHeadingContainer: {
//     alignItems: 'center',
//     rowGap: hp('2%'),
//   },
//   footerContainer: {
//     flex: 0.5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bold: {
//     fontWeight: '600',
//   },
//   submitButton: {
//     width: wp('50%'),
//     borderRadius: hp('10%'),
//   },
//   statusDescriptionContainer: {
//     height: hp('12%'),
//     width: '100%',
//     padding: '3%',
//     borderRadius: 10,
//     backgroundColor: colors.lightGray,
//   },
//   text: {
//     fontSize: hp('1.8%'),
//     color: colors.black,
//     width: '100%',
//     height: hp('10%'),
//   },
//   box: {
//     rowGap: hp('1%'),
//     width: '90%',
//   },
// });
//
// export default AnnotateImage;
