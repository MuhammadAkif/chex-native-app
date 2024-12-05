import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

import {ImagePicker_New, ItemPickerLabel} from '../index';
import {colors, ExpandedCardStyles} from '../../Assets/Styles';
import {getAnnotationStatus, isNotEmpty} from '../../Utils';

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
  borderBottomWidth = 1,
}) => {
  const [visibleTiles, setVisibleTiles] = useState({
    zero: true,
    one: false,
    two: false,
  });
  const [hideAddLAbel, setHideAddLAbel] = useState(false);
  const [annotations, setAnnotations] = useState({
    imageURL: false,
    imageURLOne: false,
    imageURLTwo: false,
  });
  const {fileDetails, exteriorItems} = useSelector(
    state => state.newInspection,
  );
  let {title, groupType, key} = ExteriorDetails;
  const displayLabel = imageURL || imageURLOne || imageURLTwo;
  const labelVisible = hideAddLAbel ? !hideAddLAbel : isNotEmpty(displayLabel);
  const {zero, one, two} = visibleTiles;
  const displayImage = imageURL || zero;
  const displayImageOne = imageURLOne || one;
  const displayImageTwo = imageURLTwo || two;

  useEffect(() => {
    updateTiles();
    setAnnotations({
      imageURL: getAnnotationStatus(fileDetails, imageURL_ID),
      imageURLOne: getAnnotationStatus(fileDetails, imageURLOne_ID),
      imageURLTwo: getAnnotationStatus(fileDetails, imageURLTwo_ID),
    });
  }, [fileDetails, exteriorItems]);
  useEffect(() => {
    const allTrue = Object.values(visibleTiles).every(value => value === true);
    setHideAddLAbel(allTrue);
  }, [visibleTiles, hideAddLAbel]);

  const onAddImagePress = () => {
    if (!zero) {
      setVisibleTiles(prevState => ({...prevState, zero: true}));
    } else if (!one) {
      setVisibleTiles(prevState => ({...prevState, one: true}));
    } else if (!two) {
      setVisibleTiles(prevState => ({...prevState, two: true}));
    } else {
    }
  };
  function updateTiles() {
    if (imageURL && !zero) {
      setVisibleTiles(prevState => ({...prevState, zero: true}));
    }
    if (imageURLOne && !one) {
      setVisibleTiles(prevState => ({...prevState, one: true}));
    }
    if (imageURLTwo && !two) {
      setVisibleTiles(prevState => ({...prevState, two: true}));
    }
  }
  return (
    <View style={styles.OuterContainer}>
      <ItemPickerLabel
        label={title}
        labelVisible={labelVisible}
        onAddNotePress={onAddImagePress}
      />
      <View
        style={[
          styles.container,
          styles.singleTileContainer,
          {borderBottomWidth},
        ]}>
        {displayImage && (
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
        )}
        {displayImageOne && (
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
        )}
        {displayImageTwo && (
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
        )}
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
    borderColor: '#ECECEC',
  },
  singleTileContainer: {
    width: '90%',
  },
});
export default ImagesPickerContainer;
