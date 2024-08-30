import React from 'react';
import {StyleSheet} from 'react-native';
import {Canvas, RoundedRect} from '@shopify/react-native-skia';
import {colors} from '../Assets/Styles';

const CanvasDraw = ({
  x = 50,
  y = 50,
  width = 256,
  height = 256,
  r = 10,
  color = colors.deepGreen,
  style,
}) => {
  return (
    <Canvas style={[styles.canvasContainer, style]}>
      <RoundedRect
        x={x}
        y={x}
        width={width}
        height={height}
        r={r}
        color={color}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
  },
});

export default CanvasDraw;
