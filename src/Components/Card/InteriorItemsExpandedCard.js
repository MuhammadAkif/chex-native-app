import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import {ImagePicker} from '../index';
import {InteriorDriverSide, InteriorPassengerSide} from '../../Utils';

const InteriorItemsExpandedCard = ({
  handleItemPickerPress,
  interiorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Capture Image',
}) => (
  <View
    style={{
      ...expandedCardStyles.expandedCardContainer,
      ...ExpandedCardStyles.container,
    }}>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={InteriorDriverSide.title}
        pickerText={pickerText}
        imageURL={interiorItems?.driverSide}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(InteriorDriverSide)}
        onClearPress={() =>
          handleCrossPress(InteriorDriverSide.groupType, InteriorDriverSide.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            InteriorDriverSide.title,
            interiorItems?.driverSide,
          )
        }
      />
      <ImagePicker
        text={InteriorPassengerSide.title}
        pickerText={pickerText}
        imageURL={interiorItems?.passengerSide}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(InteriorPassengerSide)}
        onClearPress={() =>
          handleCrossPress(
            InteriorPassengerSide.groupType,
            InteriorPassengerSide.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            InteriorPassengerSide.title,
            interiorItems?.passengerSide,
          )
        }
      />
    </View>
  </View>
);

export default InteriorItemsExpandedCard;
