import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../../Assets/Styles';
import {InteriorDriverSide, InteriorPassengerSide} from '../../../Utils';
import {ImagesPickerContainer} from '../../index';
const {expandedCardContainer} = expandedCardStyles;
const {container} = ExpandedCardStyles;
const containerStyle = {
  ...expandedCardContainer,
  ...container,
  paddingVertical: 0,
};

const InteriorItemsAnnotationExpandedCard = ({
  handleItemPickerPress,
  interiorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Capture Image',
}) => (
  <View style={containerStyle}>
    <ImagesPickerContainer
      ExteriorDetails={InteriorDriverSide}
      pickerText={pickerText}
      imageURL={interiorItems?.driverSide}
      imageURLOne={interiorItems?.driverSide_1}
      imageURLTwo={interiorItems?.driverSide_2}
      imageURL_ID={interiorItems?.driverSideID}
      imageURLOne_ID={interiorItems?.driverSide_1ID}
      imageURLTwo_ID={interiorItems?.driverSide_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
    />
    <ImagesPickerContainer
      ExteriorDetails={InteriorPassengerSide}
      pickerText={pickerText}
      imageURL={interiorItems?.passengerSide}
      imageURLOne={interiorItems?.passengerSide_1}
      imageURLTwo={interiorItems?.passengerSide_2}
      imageURL_ID={interiorItems?.passengerSideID}
      imageURLOne_ID={interiorItems?.passengerSide_1ID}
      imageURLTwo_ID={interiorItems?.passengerSide_2ID}
      isLoading={isLoading}
      handleItemPickerPress={handleItemPickerPress}
      handleCrossPress={handleCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
    />
  </View>
);
export default InteriorItemsAnnotationExpandedCard;
