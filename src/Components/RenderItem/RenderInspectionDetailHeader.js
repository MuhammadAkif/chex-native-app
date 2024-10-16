import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {CrossFilled, Tick} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';
import {INSPECTION_STATUS} from '../../Utils/helpers';

const STATUS_ICON = {
  true: Tick,
  false: CrossFilled,
};
const {deepGreen, silverGray, lightGray, black} = colors;

const RenderInspectionDetailHeader = ({
  finalStatus,
  remarks = 'No Remarks',
}) => {
  const isPassed = finalStatus && finalStatus.toLowerCase() === 'pass';
  const ICON_COMPONENT = STATUS_ICON[isPassed];
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerText, styles.textColor]}>
        Inspection Details
      </Text>
      <View style={styles.finalStatusContainer}>
        <Text style={[styles.text, styles.textColor, {width: wp('30%')}]}>
          Final Status
        </Text>
        <ICON_COMPONENT height={hp('3%')} width={wp('8%')} color={deepGreen} />
        <Text style={[styles.text, styles.statusText, styles.textColor]}>
          {INSPECTION_STATUS[isPassed]}
        </Text>
      </View>
      <View style={styles.statusDescriptionContainer}>
        <ScrollView>
          <Text style={[styles.text, styles.textColor]}>{remarks}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: hp('30%'),
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingBottom: 20,
  },
  finalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: silverGray,
  },
  statusDescriptionContainer: {
    height: hp('12%'),
    width: '100%',
    padding: '3%',
    borderRadius: 10,
    backgroundColor: lightGray,
  },
  headerText: {
    paddingHorizontal: '2%',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  text: {
    fontSize: hp('1.8%'),
    // textTransform: 'capitalize',
  },
  statusText: {
    fontWeight: 'bold',
    marginLeft: '2%',
  },
  textColor: {color: black},
});

export default RenderInspectionDetailHeader;
