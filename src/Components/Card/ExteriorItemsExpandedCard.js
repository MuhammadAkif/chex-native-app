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
  ExteriorInteriorDriverSide,
  ExteriorInteriorPassengerSide,
} from '../../Utils';
import {ImagesPickerContainer} from '../index';

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
      paddingVertical: 0,
    }}>
    <ImagesPickerContainer
      ExteriorDetails={ExteriorFrontDetails}
      pickerText={pickerText}
      imageURL={exteriorItems?.exteriorFront}
      imageURLOne={exteriorItems?.exteriorFront_1}
      imageURLTwo={exteriorItems?.exteriorFront_2}
      imageURL_ID={exteriorItems?.exteriorFrontID}
      imageURLOne_ID={exteriorItems?.exteriorFront_1ID}
      imageURLTwo_ID={exteriorItems?.exteriorFront_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      exteriorItems={exteriorItems}
    />
    <ImagesPickerContainer
      ExteriorDetails={ExteriorRearDetails}
      pickerText={pickerText}
      imageURL={exteriorItems?.exteriorRear}
      imageURLOne={exteriorItems?.exteriorRear_1}
      imageURLTwo={exteriorItems?.exteriorRear_2}
      imageURL_ID={exteriorItems?.exteriorRearID}
      imageURLOne_ID={exteriorItems?.exteriorRear_1ID}
      imageURLTwo_ID={exteriorItems?.exteriorRear_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      exteriorItems={exteriorItems}
    />
    {!skipLeftCorners && (
      <ImagesPickerContainer
        ExteriorDetails={ExteriorFrontLeftCornerDetails}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorFrontLeftCorner}
        imageURLOne={exteriorItems?.exteriorFrontLeftCorner_1}
        imageURLTwo={exteriorItems?.exteriorFrontLeftCorner_2}
        imageURL_ID={exteriorItems?.exteriorFrontLeftCornerID}
        imageURLOne_ID={exteriorItems?.exteriorFrontLeftCorner_1ID}
        imageURLTwo_ID={exteriorItems?.exteriorFrontLeftCorner_2ID}
        isLoading={isLoading}
        handleItemPickerPress={handleItemPickerPress}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        exteriorItems={exteriorItems}
      />
    )}
    {!skipRightCorners && (
      <ImagesPickerContainer
        ExteriorDetails={ExteriorFrontRightCornerDetails}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorFrontRightCorner}
        imageURLOne={exteriorItems?.exteriorFrontRightCorner_1}
        imageURLTwo={exteriorItems?.exteriorFrontRightCorner_2}
        imageURL_ID={exteriorItems?.exteriorFrontRightCornerID}
        imageURLOne_ID={exteriorItems?.exteriorFrontRightCorner_1ID}
        imageURLTwo_ID={exteriorItems?.exteriorFrontRightCorner_2ID}
        isLoading={isLoading}
        handleItemPickerPress={handleItemPickerPress}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        exteriorItems={exteriorItems}
      />
    )}
    {!skipLeftCorners && (
      <ImagesPickerContainer
        ExteriorDetails={ExteriorRearLeftCornerDetails}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorRearLeftCorner}
        imageURLOne={exteriorItems?.exteriorRearLeftCorner_1}
        imageURLTwo={exteriorItems?.exteriorRearLeftCorner_2}
        imageURL_ID={exteriorItems?.exteriorRearLeftCornerID}
        imageURLOne_ID={exteriorItems?.exteriorRearLeftCorner_1ID}
        imageURLTwo_ID={exteriorItems?.exteriorRearLeftCorner_2ID}
        isLoading={isLoading}
        handleItemPickerPress={handleItemPickerPress}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        exteriorItems={exteriorItems}
      />
    )}
    {!skipRightCorners && (
      <ImagesPickerContainer
        ExteriorDetails={ExteriorRearRightCornerDetails}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorRearRightCorner}
        imageURLOne={exteriorItems?.exteriorRearRightCorner_1}
        imageURLTwo={exteriorItems?.exteriorRearRightCorner_2}
        imageURL_ID={exteriorItems?.exteriorRearRightCornerID}
        imageURLOne_ID={exteriorItems?.exteriorRearRightCorner_1ID}
        imageURLTwo_ID={exteriorItems?.exteriorRearRightCorner_2ID}
        isLoading={isLoading}
        handleItemPickerPress={handleItemPickerPress}
        handleCrossPress={handleCrossPress}
        handleMediaModalDetailsPress={handleMediaModalDetailsPress}
        exteriorItems={exteriorItems}
      />
    )}
    <ImagesPickerContainer
      ExteriorDetails={ExteriorInteriorDriverSide}
      pickerText={pickerText}
      imageURL={exteriorItems?.exteriorInteriorDriverSide}
      imageURLOne={exteriorItems?.exteriorInteriorDriverSide_1}
      imageURLTwo={exteriorItems?.exteriorInteriorDriverSide_2}
      imageURL_ID={exteriorItems?.exteriorInteriorDriverSideID}
      imageURLOne_ID={exteriorItems?.exteriorInteriorDriverSide_1ID}
      imageURLTwo_ID={exteriorItems?.exteriorInteriorDriverSide_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      exteriorItems={exteriorItems}
    />
    <ImagesPickerContainer
      ExteriorDetails={ExteriorInteriorPassengerSide}
      pickerText={pickerText}
      imageURL={exteriorItems?.exteriorInteriorPassengerSide}
      imageURLOne={exteriorItems?.exteriorInteriorPassengerSide_1}
      imageURLTwo={exteriorItems?.exteriorInteriorPassengerSide_2}
      imageURL_ID={exteriorItems?.exteriorInteriorPassengerSideID}
      imageURLOne_ID={exteriorItems?.exteriorInteriorPassengerSide_1ID}
      imageURLTwo_ID={exteriorItems?.exteriorInteriorPassengerSide_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      exteriorItems={exteriorItems}
    />
    <ImagesPickerContainer
      ExteriorDetails={ExteriorInsideCargoRoofDetails}
      pickerText={pickerText}
      imageURL={exteriorItems?.exteriorInsideCargoRoof}
      imageURLOne={exteriorItems?.exteriorInsideCargoRoof_1}
      imageURLTwo={exteriorItems?.exteriorInsideCargoRoof_2}
      imageURL_ID={exteriorItems?.exteriorInsideCargoRoofID}
      imageURLOne_ID={exteriorItems?.exteriorInsideCargoRoof_1ID}
      imageURLTwo_ID={exteriorItems?.exteriorInsideCargoRoof_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      exteriorItems={exteriorItems}
    />
  </View>
);
export default ExteriorItemsExpandedCard;
