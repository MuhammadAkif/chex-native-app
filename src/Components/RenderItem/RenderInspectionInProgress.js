import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Column} from '../index';
import {extractDate} from '../../Utils';
import {Cross} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';

const {red, white} = colors;

const RenderInspectionInProgress = ({
  item,
  styles,
  handleContinuePress,
  onCrossPress,
  isLoading,
  inspectionID,
}) => (
  <View style={styles.cardContainer}>
    <TouchableOpacity
      style={styles.crossIconContainer}
      onPress={() => onCrossPress(item?.id)}
      disabled={isLoading}>
      <Cross height={hp('2.3%')} width={wp('5%')} color={red} />
    </TouchableOpacity>
    <View style={styles.tableContainer}>
      <Column
        title={'License Plate no.'}
        description={item?.Vehicle?.licensePlateNumber}
        containerStyle={styles.columnContainer}
        titleStyle={styles.columnTitleText}
        descriptionStyles={styles.columnDescriptionText}
      />
      <Column
        title={'Date Created'}
        description={extractDate(item?.createdAt)}
        containerStyle={styles.columnContainer}
        titleStyle={styles.columnTitleText}
        descriptionStyles={styles.columnDescriptionText}
      />
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          {width: inspectionID === item?.id && isLoading ? wp('37%') : null},
        ]}
        disabled={isLoading}
        onPress={() => handleContinuePress(item?.id)}>
        {inspectionID === item?.id && isLoading ? (
          <ActivityIndicator size={'small'} color={white} />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

export default RenderInspectionInProgress;
