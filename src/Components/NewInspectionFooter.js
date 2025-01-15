import React from 'react';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {Comment, PrimaryGradientButton} from './index';
import {NewInspectionStyles} from '../Assets/Styles';

const flex = {
  true: 0.3,
  false: 0.15,
};

const {footerContainer} = NewInspectionStyles;

const NewInspectionFooter = ({submitVisible, onSubmitPress, isLoading}) => {
  const containerStyle = {flex: flex[submitVisible]};
  return (
    <View style={[footerContainer, styles.container, containerStyle]}>
      {submitVisible && (
        <PrimaryGradientButton
          text={'Submit'}
          onPress={onSubmitPress}
          disabled={isLoading}
        />
      )}
      <Comment sideIcon={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    flexDirection: 'column-reverse',
    rowGap: hp('1%'),
  },
});

export default NewInspectionFooter;
