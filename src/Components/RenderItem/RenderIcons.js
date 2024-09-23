import React from 'react';
import {TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Exclamation} from '../../Assets/Icons';

const RenderIcons = ({marker, index, handleExclamationMarkPress}) => {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        zIndex: 1,
        top: marker.coordinates.y,
        left: marker.coordinates.x,
      }}
      onPress={() => handleExclamationMarkPress(marker.id)}>
      <Exclamation height={hp('3%')} width={wp('6%')} />
    </TouchableOpacity>
  );
};

export default RenderIcons;
