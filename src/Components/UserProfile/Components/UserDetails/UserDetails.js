import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './styles';

const {container, text, email: emailText} = styles;

const TextField = props => (
  <Text style={props.style} numberOfLines={1} ellipsizeMode={'tail'} {...props}>
    {props.children}
  </Text>
);

const UserDetails = ({name = 'Username', email = 'my.email@chex.ai'}) => (
  <View style={container}>
    <TextField style={text}>{name}</TextField>
    <TextField style={emailText}>{email}</TextField>
  </View>
);

export default UserDetails;
