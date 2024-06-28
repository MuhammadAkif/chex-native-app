import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import ImagePicker from '../ItemPicker/ImagePicker';
import {
  LeftFrontTireDetails,
  LeftRearTireDetails,
  RightFrontTireDetails,
  RightRearTireDetails,
} from '../../Utils';

const TiresItemsExpandedCard = ({
  handleItemPickerPress,
  tires,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
}) => (
  <View
    style={[
      expandedCardStyles.expandedCardContainer,
      ExpandedCardStyles.container,
    ]}>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={LeftFrontTireDetails.title}
        pickerText={'Upload Image'}
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
        pickerText={'Upload Image'}
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
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={RightFrontTireDetails.title}
        pickerText={'Upload Image'}
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
        pickerText={'Upload Image'}
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

export default TiresItemsExpandedCard;
