import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

import {ImagePicker_New, ItemPickerLabel} from '../index';
import {colors, ExpandedCardStyles} from '../../Assets/Styles';
import {getAnnotationStatus} from '../../Utils';

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
  const [imageURL_Annotated, setImageURL_Annotated] = useState(false);
  const [imageURLOne_Annotated, setImageURLOne_Annotated] = useState(false);
  const [imageURLTwo_Annotated, setImageURLTwo_Annotated] = useState(false);
  const {fileDetails, exteriorItems} = useSelector(
    state => state.newInspection,
  );
  let {title, groupType, key} = ExteriorDetails;
  useEffect(() => {
    let image_Annotated = getAnnotationStatus(fileDetails, imageURL_ID);
    let imageOne_Annotated = getAnnotationStatus(fileDetails, imageURLOne_ID);
    let imageTwo_Annotated = getAnnotationStatus(fileDetails, imageURLTwo_ID);
    setImageURL_Annotated(image_Annotated);
    setImageURLOne_Annotated(imageOne_Annotated);
    setImageURLTwo_Annotated(imageTwo_Annotated);
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
          isAnnotated={imageURL_Annotated}
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
          isAnnotated={imageURLOne_Annotated}
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
          isAnnotated={imageURLTwo_Annotated}
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
    backgroundColor: colors.white,
    ...ExpandedCardStyles.container,
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
