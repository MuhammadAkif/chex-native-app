import React from 'react';
import {View, StyleSheet} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import ImagePicker from '../ItemPicker/ImagePicker';
import {VideoPicker} from '../index';
import {
  ExteriorFrontDetails,
  ExteriorLeftDetails,
  ExteriorRearDetails,
  ExteriorRightDetails,
} from '../../Utils';

const ExteriorItemsExpandedCard = ({
  handleItemPickerPress,
  exteriorItems,
  handleCrossPress,
  isLoading,
}) => (
  <View
    style={[
      expandedCardStyles.expandedCardContainer,
      ExpandedCardStyles.container,
    ]}>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={'Exterior Left'}
        pickerText={'Upload Image'}
        imageURL={exteriorItems?.exteriorLeft}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorLeftDetails)}
        onClearPress={() => handleCrossPress(ExteriorLeftDetails.key)}
      />
      <ImagePicker
        text={'Exterior Right'}
        pickerText={'Upload Image'}
        imageURL={exteriorItems?.exteriorRight}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRightDetails)}
        onClearPress={() => handleCrossPress(ExteriorRightDetails.key)}
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <VideoPicker
        text={'Exterior Front'}
        pickerText={'Upload Video'}
        videoURL={exteriorItems?.exteriorFront}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorFrontDetails)}
        onClearPress={() => handleCrossPress(ExteriorFrontDetails.key)}
      />
      <VideoPicker
        text={'Exterior Rear'}
        pickerText={'Upload Video'}
        videoURL={exteriorItems?.exteriorRear}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRearDetails)}
        onClearPress={() => handleCrossPress(ExteriorRearDetails.key)}
      />
    </View>
  </View>
);

export default ExteriorItemsExpandedCard;
