import React from 'react';
import {View} from 'react-native';

import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import {VideoPicker, ImagePicker} from '../index';
import {
  ExteriorFrontDetails,
  ExteriorFrontLeftCornerDetails,
  ExteriorRearDetails,
  ExteriorFrontRightCornerDetails,
  ExteriorRearLeftCornerDetails,
  ExteriorRearRightCornerDetails,
  ExteriorInsideCargoRoofDetails,
} from '../../Utils';

const ExteriorItemsExpandedCard = ({
  handleItemPickerPress,
  exteriorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Upload Video',
}) => (
  <View
    style={[
      expandedCardStyles.expandedCardContainer,
      ExpandedCardStyles.container,
    ]}>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={ExteriorFrontDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorFront}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorFrontDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorFrontDetails.groupType,
            ExteriorFrontDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorFrontDetails.title,
            exteriorItems?.exteriorFront,
          )
        }
      />
      <ImagePicker
        text={ExteriorRearDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorRear}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRearDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorRearDetails.groupType,
            ExteriorRearDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorRearDetails.title,
            exteriorItems?.exteriorRear,
          )
        }
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={ExteriorFrontLeftCornerDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorLeft}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorFrontLeftCornerDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorFrontLeftCornerDetails.groupType,
            ExteriorFrontLeftCornerDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorFrontLeftCornerDetails.title,
            exteriorItems?.exteriorFrontLeftCorner,
          )
        }
      />
      <ImagePicker
        text={ExteriorFrontRightCornerDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorRight}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorFrontRightCornerDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorFrontRightCornerDetails.groupType,
            ExteriorFrontRightCornerDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorFrontRightCornerDetails.title,
            exteriorItems?.exteriorFrontRightCorner,
          )
        }
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={ExteriorRearLeftCornerDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorLeft}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRearLeftCornerDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorRearLeftCornerDetails.groupType,
            ExteriorRearLeftCornerDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorRearLeftCornerDetails.title,
            exteriorItems?.exteriorRearLeftCorner,
          )
        }
      />
      <ImagePicker
        text={ExteriorRearRightCornerDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorRight}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorRearRightCornerDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorRearRightCornerDetails.groupType,
            ExteriorRearRightCornerDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorRearRightCornerDetails.title,
            exteriorItems?.exteriorRearRightCorner,
          )
        }
      />
    </View>
    <View style={ExpandedCardStyles.itemPickerContainer}>
      <ImagePicker
        text={ExteriorInsideCargoRoofDetails.title}
        pickerText={pickerText}
        imageURL={exteriorItems?.exteriorRight}
        isLoading={isLoading}
        onPress={() => handleItemPickerPress(ExteriorInsideCargoRoofDetails)}
        onClearPress={() =>
          handleCrossPress(
            ExteriorInsideCargoRoofDetails.groupType,
            ExteriorInsideCargoRoofDetails.key,
          )
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            ExteriorInsideCargoRoofDetails.title,
            exteriorItems?.exteriorInsideCargoRoof,
          )
        }
      />
    </View>
  </View>
);

export default ExteriorItemsExpandedCard;
