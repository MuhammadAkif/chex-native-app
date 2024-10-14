import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../../Assets/Styles';
import {InteriorDriverSide, InteriorPassengerSide} from '../../../Utils';
import {ImagesPickerContainer} from '../../index';

const containerStyle = {
  ...expandedCardStyles.expandedCardContainer,
  ...ExpandedCardStyles.container,
  paddingVertical: 0,
};

const InteriorItemsAnnotationExpandedCard = ({
  handleItemPickerPress,
  exteriorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Capture Image',
}) => (
  <View style={containerStyle}>
    <ImagesPickerContainer
      ExteriorDetails={InteriorDriverSide}
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
      ExteriorDetails={InteriorPassengerSide}
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
  </View>
);
export default InteriorItemsAnnotationExpandedCard;
