import React, {useEffect, useState, memo} from 'react';
import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {Image} from './index';
import {progressZIndex} from '../Utils/helpers';
import {fallBack} from '../Utils';

const loadingProgressInitialState = {
  progress: 0,
  display: true,
};

const Custom_Image = ({source, onProgress = fallBack, onLoadEnd = fallBack, loadingContainerStyle = {}, imageStyle = {}}) => {
  const [loadingProgress, setLoadingProgress] = useState(loadingProgressInitialState);
  const zIndex = progressZIndex[loadingProgress.progress === 1];

  useEffect(() => {
    return () => setLoadingProgress(loadingProgressInitialState);
  }, []);

  const on_Progress = e => {
    const {loaded, total} = e.nativeEvent;
    if (loadingProgress.progress < 1) {
      const progress = loaded / total;
      if (progress !== loadingProgress.progress) {
        setLoadingProgress({progress, display: true});
        onProgress(e);
      }
    }
  };

  const on_LoadEnd = () => {
    setLoadingProgress(prevState => ({...prevState, display: false}));
    onLoadEnd();
  };

  return (
    <Image
      source={source}
      resizeMode="stretch"
      style={[styles.image, imageStyle]}
      // onProgress={on_Progress}
      // onLoadEnd={on_LoadEnd}
    ></Image>
  );
};

const styles = StyleSheet.create({
  image: {
    height: hp('12%'),
    width: wp('40%'),
    borderRadius: 10,
  },
});

export default memo(Custom_Image);
