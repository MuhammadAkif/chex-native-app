import {useState} from 'react';

import {pickMedia} from '../services/MediaPicker';

/**
 * Custom hook for selecting media files (images or videos) from the user's device.
 *
 * @param {Object} defaultParams - Default parameters for the media picker.
 * @param {string} [defaultParams.mediaType='image'] - Type of media to select ('image' or 'video').
 * @param {boolean} [defaultParams.multiple=false] - Whether multiple files can be selected.
 * @returns {Object} - Returns selected media data, error state, and a function to open the media picker.
 * @property {Object | Object[]} media - Selected media file(s).
 * @property {Error | null} error - Any error encountered during media selection.
 * @property {Function} selectMedia - Function to trigger media selection.
 */
function useMediaPicker(defaultParams = {}) {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Opens the media picker with given or default parameters.
   *
   * @param {Object} params - Customizable options for the media picker (overrides defaultParams).
   * @returns {Promise<void>}
   */
  const selectMedia = async (params = {}) => {
    try {
      const result = await pickMedia({...defaultParams, ...params});
      setMedia(result); // The result may be an array if multiple files are selected
      setError(null); // Reset error if the selection is successful
    } catch (err) {
      console.error('Error selecting media:', err);
      setError(err);
      throw err;
    }
  };

  return {media, error, selectMedia};
}

export default useMediaPicker;
