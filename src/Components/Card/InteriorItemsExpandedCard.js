import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ExpandedCardStyles, expandedCardStyles } from '../../Assets/Styles';
import { ImagePicker } from '../index';
import { InteriorDriverSide, InteriorPassengerSide } from '../../Utils';

const { container, itemPickerContainer } = ExpandedCardStyles;
const { expandedCardContainer } = expandedCardStyles;

const hasCategory = (array, categoryName) =>
  array.some(item => item?.categoryName === categoryName);

/**
 * Enriches details with categoryId and companyConfigId from config
 * when a matching categoryName (config) === subCategory (details) exists.
 * Safe when config is empty or no match — returns details unchanged.
 */
const enrichWithCategoryId = (details, config) => {
  if (!config?.length || !details?.subCategory) {
    return details;
  }
  const match = config.find(item => item?.categoryName === details.subCategory);
  if (!match) {
    return details;
  }
  return {
    ...details,
    categoryId: match.categoryId,
    companyConfigId: match.companyConfigId,
  };
};

const InteriorItemsExpandedCard = ({
  handleItemPickerPress,
  interiorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText,
  interiorItemsConfig = [],
}) => {
  const { t } = useTranslation();
  const defaultPickerText = pickerText || t('interiorItems.captureImage');

  const hasInteriorConfig = interiorItemsConfig.length > 0;
  const hasDriverSide = !hasInteriorConfig || hasCategory(interiorItemsConfig, 'interior_driver_side');
  const hasPassengerSide = !hasInteriorConfig || hasCategory(interiorItemsConfig, 'interior_passenger_side');

  return (
    <View
      style={{
        ...expandedCardContainer,
        ...container,
      }}>
      <View style={itemPickerContainer}>
        {hasDriverSide && (
          <ImagePicker
            text={InteriorDriverSide.title}
            pickerText={defaultPickerText}
            imageURL={interiorItems?.driverSide}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(enrichWithCategoryId(InteriorDriverSide, interiorItemsConfig))}
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
        )}
        {hasPassengerSide && (
          <ImagePicker
            text={InteriorPassengerSide.title}
            pickerText={defaultPickerText}
            imageURL={interiorItems?.passengerSide}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(enrichWithCategoryId(InteriorPassengerSide, interiorItemsConfig))}
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
        )}
      </View>
    </View>
  );
};

export default InteriorItemsExpandedCard;
