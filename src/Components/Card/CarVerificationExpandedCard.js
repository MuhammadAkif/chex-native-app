import React from 'react';
import {View} from 'react-native';

import {expandedCardStyles} from '../../Assets/Styles';
import ImagePicker from '../ItemPicker/ImagePicker';
import {LicensePlateDetails, OdometerDetails} from '../../Utils';

const CarVerificationExpandedCard = ({
  handleItemPickerPress,
  carVerificationItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Upload Image',
  isLicensePlateUploaded,
}) => (
  <View style={expandedCardStyles.expandedCardContainer}>
    <View
      style={[
        expandedCardStyles.uploadImageAndTextContainer,
        {paddingVertical: 10},
      ]}>
      <ImagePicker
        onPress={() => handleItemPickerPress(LicensePlateDetails)}
        pickerText={pickerText}
        text={LicensePlateDetails.title}
        isLoading={isLoading}
        imageURL={carVerificationItems?.licensePlate}
        onClearPress={() =>
          handleCrossPress('carVerificationItems', LicensePlateDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            LicensePlateDetails.title,
            carVerificationItems?.licensePlate,
          )
        }
      />
    </View>
    <View
      style={[
        expandedCardStyles.uploadImageAndTextContainer,
        {paddingVertical: 10},
      ]}>
      <ImagePicker
        onPress={() => handleItemPickerPress(OdometerDetails)}
        pickerText={pickerText}
        text={OdometerDetails.title}
        isLoading={isLicensePlateUploaded || isLoading}
        imageURL={carVerificationItems?.odometer}
        onClearPress={() =>
          handleCrossPress('carVerificationItems', OdometerDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            OdometerDetails.title,
            carVerificationItems?.odometer,
          )
        }
      />
    </View>
  </View>
);

export default CarVerificationExpandedCard;
