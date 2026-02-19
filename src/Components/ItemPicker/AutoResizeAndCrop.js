import ImageEditor from '@react-native-community/image-editor';
import { Platform, Dimensions } from 'react-native';


const autoResizeAndCrop = async (photo) => {
    try {
        const { width, height, path, uri } = photo;
    
        const sourceUri =
          uri || (Platform.OS === 'android' ? `file://${path}` : path);
    
        // Preview ratio (100% width, 25% height)
        const screenW = Dimensions.get('window').width;
        const screenH = Dimensions.get('window').height * 0.25;
    
        const previewRatio = screenW / screenH;
    
        let cropWidth, cropHeight;
    
        if (width / height > previewRatio) {
          // Image is wider than preview
          cropHeight = height;
          cropWidth = Math.floor(height * previewRatio);
        } else {
          // Image is taller than preview
          cropWidth = width;
          cropHeight = Math.floor(width / previewRatio);
        }
    
        const offsetX = Math.floor((width - cropWidth) / 2);
        const offsetY = Math.floor((height - cropHeight) / 2);
    
        const croppedUri = await ImageEditor.cropImage(sourceUri, {
          offset: { x: offsetX, y: offsetY },
          size: { width: cropWidth, height: cropHeight },
        });
    
        return {
          uri: croppedUri?.uri,
          width: cropWidth,
          height: cropHeight,
        };
        debugger;
    } catch (error) {
        console.log('Auto crop failed:', error);
        debugger;
        return photo;
      }
};



export default autoResizeAndCrop;
