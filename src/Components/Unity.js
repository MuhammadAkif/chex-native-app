import React, {useRef, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import UnityView from '@azesmway/react-native-unity';

import {colors} from '../Assets/Styles';

const Unity = () => {
  const unityRef = useRef(null);

  useEffect(() => {
    if (unityRef?.current) {
      const message = {
        gameObject: 'gameObject',
        methodName: 'methodName',
        message: 'message',
      };
      unityRef.current.postMessage(
        message.gameObject,
        message.methodName,
        message.message,
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>React Native</Text>
      </View>
      <UnityView
        ref={unityRef}
        style={styles.unity}
        onUnityMessage={result => {
          console.log('onUnityMessage', result.nativeEvent.message);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.5,
    backgroundColor: colors.cobaltBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unity: {
    flex: 1,
    transformOrigin: 'top right',
  },
});

export default Unity;
