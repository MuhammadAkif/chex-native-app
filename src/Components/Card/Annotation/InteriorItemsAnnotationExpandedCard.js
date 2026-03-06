import React from 'react';
import { View } from 'react-native';
import { ExpandedCardStyles, expandedCardStyles } from '../../../Assets/Styles';
import { InteriorDriverSide, InteriorPassengerSide } from '../../../Utils';
import { ImagesPickerContainer } from '../../index';
import { useTranslation } from 'react-i18next';
const { expandedCardContainer } = expandedCardStyles;
const { container } = ExpandedCardStyles;
const containerStyle = {
  ...expandedCardContainer,
  ...container,
  paddingVertical: 0,
};

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

const InteriorItemsAnnotationExpandedCard = ({
  handleItemPickerPress,
  interiorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText,
  interiorItemsConfig = [],
}) => {
  const hasInteriorConfig = interiorItemsConfig.length > 0;
  const hasDriverSide = !hasInteriorConfig || interiorItemsConfig.some(item => item?.categoryName === 'interior_driver_side');
  const hasPassengerSide = !hasInteriorConfig || interiorItemsConfig.some(item => item?.categoryName === 'interior_passenger_side');

  const { t } = useTranslation();
  const defaultPickerText = pickerText || t('common.captureImage');
  return (
    <View style={containerStyle}>
      {hasDriverSide && (
        <ImagesPickerContainer
          ExteriorDetails={enrichWithCategoryId(InteriorDriverSide, interiorItemsConfig)}
          pickerText={defaultPickerText}
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
          borderBottomWidth={hasPassengerSide ? 1 : 0}
        />
      )}
      {hasPassengerSide && (
        <ImagesPickerContainer
          ExteriorDetails={enrichWithCategoryId(InteriorPassengerSide, interiorItemsConfig)}
          pickerText={defaultPickerText}
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
          borderBottomWidth={0}
        />
      )}
    </View>
  );
};
export default InteriorItemsAnnotationExpandedCard;
