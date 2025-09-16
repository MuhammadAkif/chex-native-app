import {View, StyleSheet, Platform, Pressable} from 'react-native';
import React from 'react';
import {colors} from '../../Assets/Styles';
import {Platforms} from '../../Constants';

const CardWrapper = ({children, style, onPress}) => {
  return (
    <Pressable onPress={onPress} style={[styles.cardContainer, style]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderWidth: Platform.OS === Platforms.ANDROID ? 0.5 : undefined,
    borderColor: colors.gray,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 20,
  },
});

export default CardWrapper;
