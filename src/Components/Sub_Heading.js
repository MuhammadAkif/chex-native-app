import React from 'react';
import {Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {isNotEmpty} from '../Utils';
import {colors, dot} from '../Assets/Styles';

const {blueGray} = colors;

const Sub_Heading = ({text = '', styles = {}}) => {
  if (!isNotEmpty(text)) {
    return null;
  }
  return (
    <View style={styles.subHeadingContainer}>
      <View style={{...dot, ...styles.dot}} />
      <Text
        style={{
          ...styles.instructionsText,
          color: blueGray,
          width: wp('75%'),
        }}>
        {text}
      </Text>
    </View>
  );
};
export default Sub_Heading;
