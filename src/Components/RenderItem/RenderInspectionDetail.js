import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {Play} from '../../Assets/Icons';

const {width} = Dimensions.get('window');

const RenderInspectionDetail = ({item}) => (
  <View style={styles.container}>
    <FastImage
      source={{uri: item?.url}}
      resizeMode={'stretch'}
      style={styles.image}
    />
    {item?.name === 'Overview' && (
      <View style={styles.circle}>
        <Play
          height={hp('4%')}
          width={wp('4%')}
          color={'rgba(255, 255, 255, 0.7)'}
        />
      </View>
    )}
    <Text style={styles.text}>{item?.name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: '3%',
  },
  image: {
    height: hp('12%'),
    width: wp('40%'),
    borderRadius: 10,
  },
  text: {
    fontSize: hp('1.7%'),
    lineHeight: 30,
    color: colors.black,
  },
  circle: {
    height: width * 0.09,
    width: width * 0.09,
    borderRadius: circleBorderRadius,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '5%',
    backgroundColor: 'rgba(0, 27, 81, 0.4)',
    top: hp('5%'),
    left: wp('20%'),
    zIndex: 1,
  },
});

export default RenderInspectionDetail;
