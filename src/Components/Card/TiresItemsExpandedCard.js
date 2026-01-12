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

const TiresItemsExpandedCard = ({
  handleItemPickerPress,
  tires,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText,
}) => {
  const { t } = useTranslation();
  const defaultPickerText = pickerText || t('tiresItems.captureImage');

  return (
    <View style={[expandedCardContainer, container]}>
      <View style={itemPickerContainer}>
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
      </View>
      <View style={itemPickerContainer}>
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
      </View>
    </View>
  );
};

export default TiresItemsExpandedCard;
