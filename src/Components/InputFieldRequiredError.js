import React from 'react';
import {Text} from 'react-native';

import {errorStyle} from '../Assets/Styles';

const InputFieldRequiredError = ({touched, error}) => (
  <>
    {touched && error && (
      <Text style={errorStyle.errorsTextStyle}>{error}</Text>
    )}
  </>
);

export default InputFieldRequiredError;
