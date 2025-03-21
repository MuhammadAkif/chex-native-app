import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import {FlashAuto, FlashOff, FlashOn} from '../../../Assets/Icons';
import ExpandableSection from './ExpandableSection';

const FLASH_MODES = {on: FlashOn, off: FlashOff, auto: FlashAuto};

const FlashModeToggle = ({
  onFlashModeChange,
  height,
  width,
  color,
  flashMode,
}) => {
  const [toggleFlash, setToggleFlash] = useState(false);
  const FlashMode = FLASH_MODES[flashMode];

  const toggleFlashMode = () => {
    setToggleFlash(prevState => !prevState);
  };

  const handleFlashModeChange = mode => {
    toggleFlashMode();
    onFlashModeChange(mode);
  };

  return (
    <TouchableOpacity>
      {!toggleFlash ? (
        <FlashMode
          height={height}
          width={width}
          color={color}
          onPress={toggleFlashMode}
        />
      ) : (
        <ExpandableSection
          onChange={handleFlashModeChange}
          activeMode={flashMode}
        />
      )}
    </TouchableOpacity>
  );
};

export default FlashModeToggle;
