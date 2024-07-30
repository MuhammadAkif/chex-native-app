import React, {useRef, useState} from 'react';
import UnityView from '@azesmway/react-native-unity';
import {Button, Text, StyleSheet, TextInput, View} from 'react-native';
const UnityAndRn = () => {
  const unityRef = useRef < UnityView > null;
  const [textFromUnity, setTextFromUnity] = useState('No text received');
  const [messageToUnity, setMessageToUnity] = useState('');
  const [buttonColor, setButtonColor] = useState('rgba(0, 0, 255, 1)');
  let unityData = {
    message: messageToUnity ?? 'Hell yeah',
    color: {a: 1.0, b: 0.0, g: 0.0, r: 1.0},
  };
  const sendDataToUnity = () => {
    if (unityRef?.current) {
      unityRef.current.postMessage(
        'GameManager',
        'GetDataFromReact',
        JSON.stringify(unityData),
      );
    }
  };
  const convertColor = colorObject => {
    const r = Math.round(colorObject.r * 255);
    const g = Math.round(colorObject.g * 255);
    const b = Math.round(colorObject.b * 255);
    const a = Math.round(colorObject.a * 255);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  const receiveDataFromUnity = result => {
    const objectReceived = JSON.parse(result.nativeEvent.message);
    setTextFromUnity(objectReceived.message);
    setButtonColor(convertColor(objectReceived.color));
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleContainer}>{textFromUnity}</Text>
        <TextInput
          textAlign="center"
          style={styles.input}
          placeholder="Write message here"
          value={messageToUnity}
          onChangeText={setMessageToUnity}
        />
        <Button
          title="Send Message to Unity"
          style={{backgroundColor: buttonColor}}
          onPress={sendDataToUnity}
        />
      </View>
      <UnityView
        ref={unityRef}
        style={styles.unityView}
        onUnityMessage={result => receiveDataFromUnity(result)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 1,
    borderColor: 'black',
    borderBottomWidth: 3,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    fontSize: 25,
  },
  input: {
    fontSize: 25,
  },
  unityView: {
    flex: 1,
    borderBottomWidth: 3,
    borderColor: 'black',
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UnityAndRn;
