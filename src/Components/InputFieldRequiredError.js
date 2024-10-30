import React from 'react';
import {Text} from 'react-native';

import {errorStyle} from '../Assets/Styles';

const {errorsTextStyle} = errorStyle;

const InputFieldRequiredError = ({touched, error}) => (
  <>{touched && error && <Text style={errorsTextStyle}>{error}</Text>}</>
);

export default InputFieldRequiredError;
