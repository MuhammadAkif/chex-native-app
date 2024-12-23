import {NativeModules} from 'react-native';

const {Safety_Tag} = NativeModules;

export default {
  connectToFirstDiscoveredTag: async () => {
    return await Safety_Tag.connectToFirstDiscoveredTag();
  },
};
