import React from 'react';
import {View} from 'react-native';

import {expandedCardStyles} from '../../Assets/Styles';
import ImagePicker from '../ItemPicker/ImagePicker';
import {LicensePlateDetails, OdometerDetails} from '../../Utils';

const CarVerificationExpandedCard = ({
  handleItemPickerPress,
  carVerificationItems,
  handleCrossPress,
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
        imageURL={carVerificationItems?.licensePlate}
        onClearPress={() => handleCrossPress(LicensePlateDetails.key)}
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
        imageURL={carVerificationItems?.odometer}
        onClearPress={() => handleCrossPress(OdometerDetails.key)}
      />
    </View>
  </View>
);

export default CarVerificationExpandedCard;
