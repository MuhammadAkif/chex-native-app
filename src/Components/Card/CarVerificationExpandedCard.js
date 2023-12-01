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
}) => (
  <View style={expandedCardStyles.expandedCardContainer}>
    <View
      style={[
        expandedCardStyles.uploadImageAndTextContainer,
        {paddingVertical: 10},
      ]}>
      <ImagePicker
        onPress={() => handleItemPickerPress(LicensePlateDetails)}
        pickerText={'Upload Image'}
        text={'License Plate'}
        isLoading={isLoading}
        imageURL={carVerificationItems?.licensePlate}
        onClearPress={() =>
          handleCrossPress('carVerificationItems', LicensePlateDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'License Plate',
            carVerificationItems?.licensePlate,
            false,
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
        pickerText={'Upload Image'}
        text={'Odometer'}
        isLoading={isLoading}
        imageURL={carVerificationItems?.odometer}
        onClearPress={() =>
          handleCrossPress('carVerificationItems', OdometerDetails.key)
        }
        handleMediaModalDetailsPress={() =>
          handleMediaModalDetailsPress(
            'Odometer',
            carVerificationItems?.odometer,
            false,
          )
        }
      />
    </View>
  </View>
);

export default CarVerificationExpandedCard;
