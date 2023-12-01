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
        text={'Left Front Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.leftFrontTire}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(LeftFrontTireDetails)}
        onClearPress={() => handleCrossPress('tires', LeftFrontTireDetails.key)}
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Left Front Tire',
            tires?.leftFrontTire,
            false,
          )
        }
      />
      <ImagePicker
        text={'Left Rear Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.leftRearTire}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(LeftRearTireDetails)}
        onClearPress={() => handleCrossPress('tires', LeftRearTireDetails.key)}
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Left Rear Tire',
            tires?.leftRearTire,
            false,
          )
        }
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={'Right Front Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.rightFrontTire}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(RightFrontTireDetails)}
        onClearPress={() => handleCrossPress('tires', RightFrontTireDetails.key)}
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Right Front Tire',
            tires?.rightFrontTire,
            false,
          )
        }
      />
      <ImagePicker
        text={'Right Rear Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.rightRearTire}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(RightRearTireDetails)}
        onClearPress={() => handleCrossPress('tires', RightRearTireDetails.key)}
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Right Rear Tire',
            tires?.rightRearTire,
            false,
          )
        }
      />
    </View>
  </View>
);

export default TiresItemsExpandedCard;
