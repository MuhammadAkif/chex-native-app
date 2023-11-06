import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Column} from '../index';
import {extractDate} from '../../Utils';
import {Cross} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';

const RenderInspectionInProgress = ({
  item,
  styles,
  handleContinuePress,
  onCrossPress,
}) => (
  <View style={styles.cardContainer}>
    <TouchableOpacity
      style={styles.crossIconContainer}
      onPress={() => onCrossPress(item?.id)}>
      <Cross height={hp('2.3%')} width={wp('5%')} color={colors.red} />
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
        style={styles.button}
        onPress={() => handleContinuePress(item?.id)}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default RenderInspectionInProgress;
