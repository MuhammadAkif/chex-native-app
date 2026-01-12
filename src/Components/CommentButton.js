import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { colors } from '../Assets/Styles';

const { gray, cobaltBlueTwo } = colors;

const CommentButton = ({
  onPress,
  text,
  optionalMessage,
}) => {
  const { t } = useTranslation();
  const defaultText = text || t('commentButton.text');
  const defaultOptionalMessage = optionalMessage || t('commentButton.optional');

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>
        {defaultText}
        <Text style={styles.optional}> {defaultOptionalMessage}</Text>
      </Text>
    </TouchableOpacity>
  );
};

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
