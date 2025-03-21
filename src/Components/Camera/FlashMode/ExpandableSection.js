import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashAuto, FlashOff, FlashOn} from '../../../Assets/Icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../../Assets/Styles';

const height = hp('4%');
const width = wp('6%');

const ExpandableSection = ({activeMode = 'off', onChange}) => {
  const [selectedMode, setSelectedMode] = useState('off');

  useEffect(() => {
    if (activeMode !== selectedMode) {
      setSelectedMode(activeMode);
    }
  }, [activeMode]);

  const onIconPress = mode => {
    setSelectedMode(mode);
    onChange(mode);
  };

  return (
    <View style={styles.container}>
      <FlashOff
        color={selectedMode === 'off' ? colors.orange : colors.white}
        height={height}
        width={width}
        onPress={() => onIconPress('off')}
      />
      <FlashAuto
        color={selectedMode === 'auto' ? colors.orange : colors.white}
        height={height}
        width={width}
        onPress={() => onIconPress('auto')}
      />
      <FlashOn
        color={selectedMode === 'on' ? colors.orange : colors.white}
        height={height}
        width={width}
        onPress={() => onIconPress('on')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: wp('40%'),
    justifyContent: 'space-between',
  },
  iconContainer: {
    paddingVertical: wp('1%'),
    paddingHorizontal: wp('2%'),
  },
});

export default ExpandableSection;
