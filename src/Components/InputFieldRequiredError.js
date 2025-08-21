import React from 'react';
import {Text} from 'react-native';

import {errorStyle} from '../Assets/Styles';

const {errorsTextStyle} = errorStyle;

const InputFieldRequiredError = ({touched, error}) => {
  return touched && error ? <Text style={errorsTextStyle}>{error}</Text> : null;
};

export default InputFieldRequiredError;
