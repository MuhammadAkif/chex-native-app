import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ExpandedCardStyles, expandedCardStyles } from '../../Assets/Styles';
import { ImagePicker } from '../index';
import { InteriorDriverSide, InteriorPassengerSide } from '../../Utils';

const { container, itemPickerContainer } = ExpandedCardStyles;
const { expandedCardContainer } = expandedCardStyles;

const InteriorItemsExpandedCard = ({
  handleItemPickerPress,
  interiorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText,
}) => {
  const { t } = useTranslation();
  const defaultPickerText = pickerText || t('interiorItems.captureImage');

  return (
    <View
      style={{
        ...expandedCardContainer,
        ...container,
      }}>
      <View style={itemPickerContainer}>
        <ImagePicker
          text={InteriorDriverSide.title}
          pickerText={defaultPickerText}
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
          pickerText={defaultPickerText}
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
};

export default InteriorItemsExpandedCard;
