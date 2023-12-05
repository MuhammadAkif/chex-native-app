import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import {VideoPicker, ImagePicker} from '../index';
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
  handleMediaModalDetailsPress,
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
        onClearPress={() =>
          handleCrossPress('exteriorItems', ExteriorLeftDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Exterior Left',
            exteriorItems?.exteriorLeft,
            false,
          )
        }
      />
      <ImagePicker
        text={'Exterior Right'}
        pickerText={'Upload Image'}
        imageURL={exteriorItems?.exteriorRight}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRightDetails)}
        onClearPress={() =>
          handleCrossPress('exteriorItems', ExteriorRightDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Exterior Right',
            exteriorItems?.exteriorRight,
            false,
          )
        }
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <VideoPicker
        text={'Exterior Front'}
        pickerText={'Upload Video'}
        videoURL={exteriorItems?.exteriorFront}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorFrontDetails)}
        onClearPress={() =>
          handleCrossPress('exteriorItems', ExteriorFrontDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Exterior Front',
            exteriorItems?.exteriorFront,
            true,
          )
        }
      />
      <VideoPicker
        text={'Exterior Rear'}
        pickerText={'Upload Video'}
        videoURL={exteriorItems?.exteriorRear}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRearDetails)}
        onClearPress={() =>
          handleCrossPress('exteriorItems', ExteriorRearDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Exterior Rear',
            exteriorItems?.exteriorRear,
            true,
          )
        }
      />
    </View>
  </View>
);

export default ExteriorItemsExpandedCard;
