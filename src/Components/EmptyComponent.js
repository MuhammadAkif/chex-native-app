import {StyleSheet, Text} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../Assets/Styles';
import React from 'react';

const {gray} = colors;

import {useTranslation} from 'react-i18next';
const EmptyComponent = ({text, style = {}}) => {
  const {t} = useTranslation();
  return (
    <Text style={{...styles.noDataText, ...style}}>
      {text || t('inspectionReviewed.noData')}
    </Text>
  );
};

const styles = StyleSheet.create({
  noDataText: {
    fontSize: hp('2%'),
    color: gray,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default EmptyComponent;
