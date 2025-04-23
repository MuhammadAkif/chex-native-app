import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {ImagePicker_New, ItemPickerLabel} from '../index';
import {colors, ExpandedCardStyles} from '../../Assets/Styles';
import {getAnnotationStatus} from '../../Utils';
import {useNewInspectionState} from '../../hooks/newInspection';

const {white} = colors;
const {container} = ExpandedCardStyles;

const ImagesPickerContainer = ({
  ExteriorDetails,
  pickerText,
  imageURL,
  imageURLOne,
  imageURLTwo,
  imageURL_ID,
  imageURLOne_ID,
  imageURLTwo_ID,
  isLoading,
  handleItemPickerPress,
  handleCrossPress,
  handleMediaModalDetailsPress,
}) => {
  const [annotations, setAnnotations] = useState({
    imageURL: false,
    imageURLOne: false,
    imageURLTwo: false,
  });
  const {fileDetails, exteriorItems} = useNewInspectionState();
  let {title, groupType, key} = ExteriorDetails;

  useEffect(() => {
    setAnnotations({
      imageURL: getAnnotationStatus(fileDetails, imageURL_ID),
      imageURLOne: getAnnotationStatus(fileDetails, imageURLOne_ID),
      imageURLTwo: getAnnotationStatus(fileDetails, imageURLTwo_ID),
    });
  }, [fileDetails, exteriorItems]);

  return (
    <View style={styles.OuterContainer}>
      <ItemPickerLabel label={title} />
      <View style={styles.container}>
        <ImagePicker_New
          text={title}
          pickerText={pickerText}
          imageURL={imageURL}
          isLoading={isLoading}
          onPress={() => handleItemPickerPress(ExteriorDetails)}
          onClearPress={() => handleCrossPress(groupType, key)}
          handleMediaModalDetailsPress={() =>
            handleMediaModalDetailsPress(title, imageURL, false, imageURL_ID)
          }
          isAnnotated={annotations.imageURL}
        />
        <ImagePicker_New
          text={title}
          pickerText={pickerText}
          imageURL={imageURLOne}
          isLoading={isLoading}
          onPress={() => handleItemPickerPress(ExteriorDetails, 1)}
          onClearPress={() => handleCrossPress(groupType, key, 1)}
          handleMediaModalDetailsPress={() =>
            handleMediaModalDetailsPress(
              title,
              imageURLOne,
              false,
              imageURLOne_ID,
            )
          }
          isAnnotated={annotations.imageURLOne}
        />
        <ImagePicker_New
          text={title}
          pickerText={pickerText}
          imageURL={imageURLTwo}
          isLoading={isLoading}
          onPress={() => handleItemPickerPress(ExteriorDetails, 2)}
          onClearPress={() => handleCrossPress(groupType, key, 2)}
          handleMediaModalDetailsPress={() =>
            handleMediaModalDetailsPress(
              title,
              imageURLTwo,
              false,
              imageURLTwo_ID,
            )
          }
          isAnnotated={annotations.imageURLTwo}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  OuterContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: white,
    ...container,
    paddingVertical: hp('1%'),
  },
  container: {
    flexDirection: 'row',
    columnGap: hp('1%'),
    paddingBottom: hp('2%'),
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
});
export default ImagesPickerContainer;
