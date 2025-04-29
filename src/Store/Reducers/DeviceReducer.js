import {Types} from '../Types';

const initialState = {
  device: {name: 'Unknown', connected: false},
};

const {DEVICE_CONNECTED, DEVICE_DISCONNECTED} = Types;

const deviceReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case DEVICE_CONNECTED:
      return {
        device: payload,
      };

    case DEVICE_DISCONNECTED:
      return initialState;

    default:
      return state;
  }
};

export default deviceReducer;
