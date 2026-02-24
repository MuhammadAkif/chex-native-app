import ImageEditor from '@react-native-community/image-editor';
import { Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const autoCropToPreview = async (photo) => {
  try {
    const { width: rawW, height: rawH, path, orientation } = photo;

    const sourceUri =
      Platform.OS === 'android' ? `file://${path}` : path;

    const previewW = wp('100%');
    const previewH = hp('25%');
    const previewAspect = previewW / previewH;

    const isPortrait =
      orientation === 'portrait' ||
      orientation === 'portrait-upside-down' ||
      (!orientation && rawW > rawH);

    // Some Android devices return pre-rotated dimensions (e.g. 720x1280) while others 
    // return raw sensor dimensions (e.g. 1280x720). Safely determine exact visual width/height:
    const imgW = isPortrait ? Math.min(rawW, rawH) : Math.max(rawW, rawH);
    const imgH = isPortrait ? Math.max(rawW, rawH) : Math.min(rawW, rawH);
    const imgAspect = imgW / imgH;

    let cropX = 0;
    let cropY = 0;
    let cropW = imgW;
    let cropH = imgH;

    if (imgAspect > previewAspect) {
      cropW = Math.round(imgH * previewAspect);
      cropX = Math.round((imgW - cropW) / 2);
    } else {
      // Image taller than preview → crop top & bottom
      cropH = Math.round(imgW / previewAspect);
      cropY = Math.round((imgH - cropH) / 2);
    }

    cropW = Math.min(cropW, imgW - cropX);
    cropH = Math.min(cropH, imgH - cropY);

    const cropData = {
      offset: { x: cropX, y: cropY },
      size: { width: cropW, height: cropH },
    };

    const croppedUri = await ImageEditor.cropImage(sourceUri, cropData);

    const resolvedUri =
      typeof croppedUri === 'string' ? croppedUri : croppedUri?.uri;
    const resolvedPath = resolvedUri?.startsWith('file://')
      ? resolvedUri.replace('file://', '')
      : resolvedUri;

    return {
      uri: resolvedUri,
      path: resolvedPath,
      width: cropW,
      height: cropH,
    };
  } catch (error) {
    console.log('autoCropToPreview failed:', error);
    return {
      ...photo,
      uri: Platform.OS === 'android' ? `file://${photo.path}` : photo.path,
    };
  }
};

export default autoCropToPreview;
