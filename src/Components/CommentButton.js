import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const {gray, cobaltBlueTwo} = colors;

const CommentButton = ({
  onPress,
  text = '+ Add Comment',
  optionalMessage = '(Optional)',
}) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Text style={styles.text}>
      {text}
      <Text style={styles.optional}> {optionalMessage}</Text>
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: wp('4%'),
    borderColor: cobaltBlueTwo,
    paddingVertical: wp('3%'),
    paddingHorizontal: wp('6%'),
  },
  text: {
    color: cobaltBlueTwo,
    fontWeight: '600',
    fontSize: hp('1.8%'),
  },
  optional: {
    color: gray,
  },
});

export default CommentButton;
