import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Check} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';
import {WINDOW} from '../../Constants';

const {width} = Dimensions.get(WINDOW);
const {orange, silverGray, royalBlue} = colors;

const RenderLicensePlateNumber = ({
  item,
  selectedNP,
  handleSelectedNP,
  isLoading,
}) => (
  <TouchableOpacity
    style={styles.itemContainer}
    disabled={isLoading}
    onPress={() => handleSelectedNP(item)}>
    <Text style={styles.text}>{item}</Text>
    <View style={styles.checkBoxContainer}>
      {selectedNP === item && (
        <Check height={hp('2.1%')} width={wp('4%')} color={orange} />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    width: wp('100%'),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderColor: silverGray,
    padding: '5%',
  },
  text: {
    fontSize: hp('1.8%'),
    color: royalBlue,
  },
  checkBoxContainer: {
    height: width * 0.06,
    width: width * 0.06,
    borderRadius: 5,
    padding: '1%',
    backgroundColor: silverGray,
  },
});
export default RenderLicensePlateNumber;
