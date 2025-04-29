import React from 'react';
import {Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {styles} from './styles';
import {colors} from '../../../../Assets/Styles';
import {Check, XMark} from '../../../../Assets/Icons';

const {white} = colors;
const {connected, disconnected, connectionStatusContainer, statusText} = styles;
const connectionStatus = {
  true: {style: connected, text: 'Connected'},
  false: {style: disconnected, text: 'Disconnected'},
};
const statusIcon = {
  true: Check,
  false: XMark,
};

const ConnectionStatus = ({isConnected = true}) => {
  const Status = statusIcon[isConnected];
  return (
    <View style={connectionStatusContainer}>
      <View
        style={[
          styles.circle,
          {backgroundColor: connectionStatus[isConnected].style.color},
        ]}>
        <Status height={hp('1.3%')} width={wp('1.5%')} color={white} />
      </View>
      <Text style={[connectionStatus[isConnected].style, statusText]}>
        {connectionStatus[isConnected].text}
      </Text>
    </View>
  );
};

export default ConnectionStatus;
