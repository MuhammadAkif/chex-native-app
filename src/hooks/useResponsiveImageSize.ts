import {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

type ImageSize = {
  width: number;
  height: number;
};

const useResponsiveImageSize = (source: string, maxWidth: number = wp('80%'), maxHeight: number = hp('50%')) => {
  const [imgSize, setImgSize] = useState<ImageSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!source) return;

    Image.getSize(
      source,
      (originalW, originalH) => {
        let finalWidth = maxWidth;
        let finalHeight = (originalH / originalW) * maxWidth;

        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = (originalW / originalH) * maxHeight;
        }

        setImgSize({
          width: finalWidth,
          height: finalHeight,
        });
      },
      () => {
        console.warn("Couldn't load image size");
      }
    );
  }, [source, maxWidth, maxHeight]);

  return imgSize;
};

export default useResponsiveImageSize;
