import React from 'react';
import {View} from 'react-native';

import {expandedCardStyles} from '../../Assets/Styles';
import ImagePicker from '../ItemPicker/ImagePicker';
import {LicensePlateDetails, OdometerDetails} from '../../Utils';

const {expandedCardContainer, uploadImageAndTextContainer} = expandedCardStyles;

const CarVerificationExpandedCard = ({
  handleItemPickerPress,
  carVerificiationItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Upload Image',
  isLicensePlateUploaded,
}) => {
  const {title, groupType, key} = LicensePlateDetails;

  return (
    <View style={expandedCardContainer}>
      <View style={[uploadImageAndTextContainer, {paddingVertical: 10}]}>
        <ImagePicker
          onPress={() => handleItemPickerPress(LicensePlateDetails)}
          pickerText={pickerText}
          text={title}
          isLoading={isLoading}
          imageURL={carVerificiationItems?.licensePlate}
          onClearPress={() => handleCrossPress(groupType, key)}
          handleMediaModalDetailsPress={() =>
            handleMediaModalDetailsPress(
              title,
              carVerificiationItems?.licensePlate,
            )
          }
        />
      </View>
      <View style={[uploadImageAndTextContainer, {paddingVertical: 10}]}>
        <ImagePicker
          onPress={() => handleItemPickerPress(OdometerDetails)}
          pickerText={pickerText}
          text={OdometerDetails.title}
          isLoading={isLicensePlateUploaded || isLoading}
          imageURL={carVerificiationItems?.odometer}
          onClearPress={() => handleCrossPress(groupType, OdometerDetails.key)}
          handleMediaModalDetailsPress={() =>
            handleMediaModalDetailsPress(
              OdometerDetails.title,
              carVerificiationItems?.odometer,
            )
          }
        />
      </View>
    </View>
  );
};

export default CarVerificationExpandedCard;
