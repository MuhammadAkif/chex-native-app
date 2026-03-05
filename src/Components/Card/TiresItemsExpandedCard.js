import React from 'react';
import { View } from 'react-native';

import { ExpandedCardStyles, expandedCardStyles } from '../../Assets/Styles';
import ImagePicker from '../ItemPicker/ImagePicker';
import {
  LeftFrontTireDetails,
  LeftRearTireDetails,
  RightFrontTireDetails,
  RightRearTireDetails,
} from '../../Utils';

const { container, itemPickerContainer } = ExpandedCardStyles;
const { expandedCardContainer } = expandedCardStyles;

import { useTranslation } from 'react-i18next';

const TIRE_CATEGORY_NAMES = {
  LEFT_FRONT: 'left_front_tire',
  LEFT_REAR: 'left_rear_tire',
  RIGHT_FRONT: 'right_front_tire',
  RIGHT_REAR: 'right_rear_tire',
};

const hasCategory = (array, categoryName) =>
  array.some(item => item?.categoryName === categoryName);

const TiresItemsExpandedCard = ({
  handleItemPickerPress,
  tires,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText,
  tiresItemsConfig = [],
}) => {
  const { t } = useTranslation();
  const defaultPickerText = pickerText || t('tiresItems.captureImage');

  const hasTiresConfig = tiresItemsConfig.length > 0;

  const showLeftFront = !hasTiresConfig || hasCategory(tiresItemsConfig, TIRE_CATEGORY_NAMES.LEFT_FRONT);
  const showLeftRear = !hasTiresConfig || hasCategory(tiresItemsConfig, TIRE_CATEGORY_NAMES.LEFT_REAR);
  const showRightFront = !hasTiresConfig || hasCategory(tiresItemsConfig, TIRE_CATEGORY_NAMES.RIGHT_FRONT);
  const showRightRear = !hasTiresConfig || hasCategory(tiresItemsConfig, TIRE_CATEGORY_NAMES.RIGHT_REAR);

  const showLeftRow = showLeftFront || showLeftRear;
  const showRightRow = showRightFront || showRightRear;

  return (
    <View style={[expandedCardContainer, container]}>
      {showLeftRow && (
        <View style={itemPickerContainer}>
          {showLeftFront && (
            <ImagePicker
              text={LeftFrontTireDetails.title}
              pickerText={defaultPickerText}
              imageURL={tires?.leftFrontTire}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(LeftFrontTireDetails)}
              onClearPress={() =>
                handleCrossPress(
                  LeftFrontTireDetails.groupType,
                  LeftFrontTireDetails.key,
                )
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(
                  LeftFrontTireDetails.title,
                  tires?.leftFrontTire,
                )
              }
            />
          )}
          {showLeftRear && (
            <ImagePicker
              text={LeftRearTireDetails.title}
              pickerText={defaultPickerText}
              imageURL={tires?.leftRearTire}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(LeftRearTireDetails)}
              onClearPress={() =>
                handleCrossPress(
                  LeftRearTireDetails.groupType,
                  LeftRearTireDetails.key,
                )
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(
                  LeftRearTireDetails.title,
                  tires?.leftRearTire,
                )
              }
            />
          )}
        </View>
      )}
      {showRightRow && (
        <View style={itemPickerContainer}>
          {showRightFront && (
            <ImagePicker
              text={RightFrontTireDetails.title}
              pickerText={defaultPickerText}
              imageURL={tires?.rightFrontTire}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(RightFrontTireDetails)}
              onClearPress={() =>
                handleCrossPress(
                  RightFrontTireDetails.groupType,
                  RightFrontTireDetails.key,
                )
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(
                  RightFrontTireDetails.title,
                  tires?.rightFrontTire,
                )
              }
            />
          )}
          {showRightRear && (
            <ImagePicker
              text={RightRearTireDetails.title}
              pickerText={defaultPickerText}
              imageURL={tires?.rightRearTire}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(RightRearTireDetails)}
              onClearPress={() =>
                handleCrossPress(
                  RightRearTireDetails.groupType,
                  RightRearTireDetails.key,
                )
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(
                  RightRearTireDetails.title,
                  tires?.rightRearTire,
                )
              }
            />
          )}
        </View>
      )}
    </View>
  );
};

export default TiresItemsExpandedCard;
