import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import {
  ExteriorFrontDetails,
  ExteriorFrontLeftCornerDetails,
  ExteriorRearDetails,
  ExteriorFrontRightCornerDetails,
  ExteriorRearLeftCornerDetails,
  ExteriorRearRightCornerDetails,
  ExteriorInsideCargoRoofDetails,
  ExteriorLeftDetails,
  ExteriorRightDetails,
} from '../../Utils';
import {ImagePickerWithFooterList} from '../index';

const ExteriorItemsExpandedCard = ({
  handleItemPickerPress,
  exteriorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Capture Image',
  skipLeft = false,
  skipLeftCorners = false,
  skipRight = false,
  skipRightCorners = false,
}) => (
  <View
    style={{
      ...expandedCardStyles.expandedCardContainer,
      ...ExpandedCardStyles.container,
    }}>
    <ImagePickerWithFooterList
      categoryDetails={ExteriorFrontDetails}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      handleItemPickerPress={handleItemPickerPress}
    />
    <ImagePickerWithFooterList
      categoryDetails={ExteriorRearDetails}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      handleItemPickerPress={handleItemPickerPress}
    />
    {!skipLeftCorners && (
      <ImagePickerWithFooterList
        categoryDetails={ExteriorFrontLeftCornerDetails}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        handleItemPickerPress={handleItemPickerPress}
      />
    )}
    {!skipRightCorners && (
      <ImagePickerWithFooterList
        categoryDetails={ExteriorFrontRightCornerDetails}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        handleItemPickerPress={handleItemPickerPress}
      />
    )}
    {!skipLeftCorners && (
      <ImagePickerWithFooterList
        categoryDetails={ExteriorRearLeftCornerDetails}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        handleItemPickerPress={handleItemPickerPress}
      />
    )}
    {!skipRightCorners && (
      <ImagePickerWithFooterList
        categoryDetails={ExteriorRearRightCornerDetails}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        handleItemPickerPress={handleItemPickerPress}
      />
    )}
    <ImagePickerWithFooterList
      categoryDetails={ExteriorInsideCargoRoofDetails}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      handleItemPickerPress={handleItemPickerPress}
    />
    {/*<View style={ExpandedCardStyles.itemPickerContainer}>*/}
    {/*  {!skipLeft && (*/}
    {/*    <ImagePicker*/}
    {/*      text={ExteriorLeftDetails.title}*/}
    {/*      pickerText={pickerText}*/}
    {/*      imageURL={exteriorItems?.exteriorLeft}*/}
    {/*      isLoading={isLoading}*/}
    {/*      onPress={() => handleItemPickerPress(ExteriorLeftDetails)}*/}
    {/*      onClearPress={() =>*/}
    {/*        handleCrossPress(*/}
    {/*          ExteriorLeftDetails.groupType,*/}
    {/*          ExteriorLeftDetails.key,*/}
    {/*        )*/}
    {/*      }*/}
    {/*      handleMediaModalDetailsPress={() =>*/}
    {/*        handleMediaModalDetailsPress(*/}
    {/*          ExteriorLeftDetails.title,*/}
    {/*          exteriorItems?.exteriorLeft,*/}
    {/*        )*/}
    {/*      }*/}
    {/*    />*/}
    {/*  )}*/}
    {/*  {!skipRight && (*/}
    {/*    <ImagePicker*/}
    {/*      text={ExteriorRightDetails.title}*/}
    {/*      pickerText={pickerText}*/}
    {/*      imageURL={exteriorItems?.exteriorRight}*/}
    {/*      isLoading={isLoading}*/}
    {/*      onPress={() => handleItemPickerPress(ExteriorRightDetails)}*/}
    {/*      onClearPress={() =>*/}
    {/*        handleCrossPress(*/}
    {/*          ExteriorRightDetails.groupType,*/}
    {/*          ExteriorRightDetails.key,*/}
    {/*        )*/}
    {/*      }*/}
    {/*      handleMediaModalDetailsPress={() =>*/}
    {/*        handleMediaModalDetailsPress(*/}
    {/*          ExteriorRightDetails.title,*/}
    {/*          exteriorItems?.exteriorRight,*/}
    {/*        )*/}
    {/*      }*/}
    {/*    />*/}
    {/*  )}*/}
    {/*</View>*/}
  </View>
);
export default ExteriorItemsExpandedCard;
