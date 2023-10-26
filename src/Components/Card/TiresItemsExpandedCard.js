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
        onPress={() => handleItemPickerPress(LeftFrontTireDetails)}
        onClearPress={() => handleCrossPress(LeftFrontTireDetails.key)}
      />
      <ImagePicker
        text={'Left Rear Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.leftRearTire}
        onPress={() => handleItemPickerPress(LeftRearTireDetails)}
        onClearPress={() => handleCrossPress(LeftRearTireDetails.key)}
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={'Right Front Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.rightFrontTire}
        onPress={() => handleItemPickerPress(RightFrontTireDetails)}
        onClearPress={() => handleCrossPress(RightFrontTireDetails.key)}
      />
      <ImagePicker
        text={'Right Rear Tire'}
        pickerText={'Upload Image'}
        imageURL={tires?.rightRearTire}
        onPress={() => handleItemPickerPress(RightRearTireDetails)}
        onClearPress={() => handleCrossPress(RightRearTireDetails.key)}
      />
    </View>
  </View>
);

export default TiresItemsExpandedCard;
