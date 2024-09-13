import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import pythonBridge from './pybridge';

const App = () => {
  const [frame, setFrame] = useState(null);
  const [detections, setDetections] = useState(0);
  const [sprite, setSprite] = useState(null);

  useEffect(() => {
    pythonBridge.call(
      'SimpleCVBridge',
      'load_sprite',
      'sprite_image.png',
      sprite => {
        setSprite(sprite);
      },
    );
  }, []);

  const handleDetect = () => {
    pythonBridge.call(
      'SimpleCVBridge',
      'process_frame',
      frame,
      sprite,
      detections => {
        setDetections(detections);
      },
    );
  };

  return (
    <View>
      <Text>Detections: {detections}</Text>
      <TouchableOpacity onPress={handleDetect}>
        <Text>Detect</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
