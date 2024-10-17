import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {Check} from '../../Assets/Icons';

const {royalBlue, white, silverGray, orangePeel} = colors;
const switchCheck = {
  true: orangePeel,
  false: silverGray,
};

const RenderStatuses = ({
  item,
  index,
  onPress,
  containerStyle = {},
  labelTextStyle = {},
}) => {
  const {name, count, selected, id} = item;
  const ActiveCheck = switchCheck[selected];
  const on_Press = () => onPress(item, index);
  return (
    <TouchableOpacity
      onPress={on_Press}
      style={{...styles.container, ...containerStyle}}>
      <View style={styles.textsContainer}>
        <Text style={{...styles.labelText, ...labelTextStyle}}>{name}</Text>
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
      </View>
      <View style={styles.checkContainer}>
        <Check height={hp('2%')} width={wp('5%')} color={ActiveCheck} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  textsContainer: {
    columnGap: hp('1%'),
    flexDirection: 'row',
  },
  labelText: {
    color: royalBlue,
    fontSize: hp('2%'),
    fontWeight: '500',
  },
  counterContainer: {
    borderRadius: circleBorderRadius,
    backgroundColor: royalBlue,
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('3%'),
  },
  counterText: {
    color: white,
    fontSize: hp('1.5%'),
  },
  checkContainer: {
    backgroundColor: silverGray,
    borderRadius: wp('1.5%'),
    padding: wp('1%'),
  },
});

export default RenderStatuses;
