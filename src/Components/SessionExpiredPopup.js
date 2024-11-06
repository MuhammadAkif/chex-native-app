import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {PrimaryGradientButton} from './';
import {modalStyle} from '../Assets/Styles';
import {SESSION_EXPIRED} from '../Constants';

const {TITLE, MESSAGE, BUTTON} = SESSION_EXPIRED;

const {container, modalContainer, header, body, footer, button, yesText} =
  modalStyle;

const SessionExpiredPopup = ({onPress}) => (
  <View style={{...container, ...StyleSheet.absoluteFillObject}}>
    <View style={modalContainer}>
      <Text style={header}>{TITLE}</Text>
      <Text style={body}>{MESSAGE}</Text>
      <View style={footer}>
        <PrimaryGradientButton
          text={BUTTON}
          buttonStyle={button}
          textStyle={yesText}
          onPress={onPress}
        />
      </View>
    </View>
  </View>
);

export default SessionExpiredPopup;
