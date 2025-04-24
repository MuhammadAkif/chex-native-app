import ImagePicker from 'react-native-image-crop-picker';

/**
 * Opens the media picker with options for media type and selection mode.
 *
 * @param {Object} params - Configuration options for the picker.
 * @param {'image' | 'video'} params.mediaType - Type of media to select (image or video).
 * @param {boolean} params.multiple - Whether multiple files can be selected.
 * @param {number} [params.width=300] - The width to which the image will be cropped.
 * @param {number} [params.height=400] - The height to which the image will be cropped.
 * @param {boolean} [params.cropping=true] - Enables cropping (for images only).
 * @returns {Promise<Object[]> | Promise<Object>} - Returns a promise resolving with the selected media object(s).
 *
 * @throws Will throw an error if the picker operation fails.
 */
export const pickMedia = async ({
  mediaType = 'image',
  multiple = false,
  ...params
} = {}) => {
  try {
    const pickerOptions = {
      width: 300,
      height: 400,
      cropping: mediaType === 'image', // Crop only if mediaType is 'image'
      multiple,
      mediaType,
      ...params,
    };

    return await ImagePicker.openPicker(pickerOptions);
  } catch (error) {
    console.error('Error picking media:', error);
    throw error;
  }
};
