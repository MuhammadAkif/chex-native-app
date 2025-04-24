import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {
  updateVehicleImage,
  removeVehicleImage,
  numberPlateSelected,
  updateIsLicensePlateUploaded,
  categoryVariant,
  file_Details,
  clearNewInspection,
  clear_Tires,
  skipLeft,
  skipLeftCorners,
  skipRight,
  skipRightCorners,
  setVehicleType,
  setLicensePlateNumber,
  clearInspectionImages,
  setCompanyId,
  setFlashMode,
  setRequired,
  batchUpdateVehicleImages,
  setMileage,
  setFeedback,
  setMileageVisible,
  setPlateNumberVisible,
  setTriggerTireStatusCheck,
  setMileageMessage,
  getMileage,
  setImageDimensions,
} from '../../Store/Actions';

/**
 * Custom hook to access dispatchable actions for managing a new inspection session.
 *
 * Provides memoized callbacks for updating images, toggling flags,
 * and performing async data fetching related to an inspection.
 *
 * @returns {{
 *   updateImage: function(group: string, item: string, uri: string, id: number): void,
 *   removeImage: function(group: string, item: string): void,
 *   selectInspectionID: function(id: string|number): void,
 *   setLicensePlateUploaded: function(status: boolean): void,
 *   setCategoryVariant: function(variant: number): void,
 *   loadFileDetails: function(inspectionId: string|number): Promise<any>,
 *   resetInspection: function(): void,
 *   clearTires: function(): void,
 *   skipLeft: function(val: boolean): void,
 *   skipLeftCorners: function(val: boolean): void,
 *   skipRight: function(val: boolean): void,
 *   skipRightCorners: function(val: boolean): void,
 *   setVehicleType: function(type: string): void,
 *   extractAndSetPlateNumber: function(uri: string): Promise<any>,
 *   clearImages: function(): void,
 *   setCompany: function(id: string|number): void,
 *   setFlash: function(mode: string): void,
 *   setRequired: function(required: object|null): void,
 *   batchUpdateImages: function(updates: Array<{group: string, item: string, uri: string, id: number}>): void,
 *   setMileage: function(mileage: string): void,
 *   setFeedback: function(feedback: string): void,
 *   setMileageVisible: function(mileage_visible: boolean): void,
 *   setPlateNumberVisible: function(plateNumber_visible: boolean): void,
 *   setTriggerTireStatusCheck: function(checkTireStatus: boolean): void,
 *   setMileageMessage: function(message: string): void,
 *   extractMileage: function(image_url: string): Promise<any>,
 *   setImageDimensions: function(dimensions: {width:number,height:number}|null): void
 * }} Object containing inspection-related action dispatchers
 */
const useNewInspectionActions = () => {
  const dispatch = useDispatch();

  return {
    /**
     * Update or add an image URI and ID in a specified inspection group.
     */
    updateImage: useCallback(
      (group, item, uri, id) => {
        dispatch(updateVehicleImage(group, item, uri, id));
      },
      [dispatch],
    ),

    /**
     * Remove (clear) an image from a specified inspection group.
     */
    removeImage: useCallback(
      (group, item) => {
        dispatch(removeVehicleImage(group, item));
      },
      [dispatch],
    ),

    /**
     * Select the current inspection session by ID.
     */
    selectInspectionID: useCallback(
      id => {
        dispatch(numberPlateSelected(id));
      },
      [dispatch],
    ),

    /**
     * Set flag indicating if a license plate image was uploaded.
     */
    setLicensePlateUploaded: useCallback(
      status => {
        dispatch(updateIsLicensePlateUploaded(status));
      },
      [dispatch],
    ),

    /**
     * Set the vehicle category variant (light vs heavy).
     */
    setCategoryVariant: useCallback(
      variant => {
        dispatch(categoryVariant(variant));
      },
      [dispatch],
    ),

    /**
     * Load detailed file metadata for an inspection session.
     * @returns {Promise<any>} API response
     */
    loadFileDetails: useCallback(
      inspectionId => {
        return dispatch(file_Details(inspectionId));
      },
      [dispatch],
    ),

    /**
     * Reset the entire inspection state to initial values.
     */
    resetInspection: useCallback(() => {
      dispatch(clearNewInspection());
    }, [dispatch]),

    /**
     * Clear all tire-related images in the inspection.
     */
    clearTires: useCallback(() => {
      dispatch(clear_Tires());
    }, [dispatch]),

    /**
     * Toggle skipping left-side exterior section.
     */
    skipLeft: useCallback(
      val => {
        dispatch(skipLeft(val));
      },
      [dispatch],
    ),

    /**
     * Toggle skipping left corner shots.
     */
    skipLeftCorners: useCallback(
      val => {
        dispatch(skipLeftCorners(val));
      },
      [dispatch],
    ),

    /**
     * Toggle skipping right-side exterior section.
     */
    skipRight: useCallback(
      val => {
        dispatch(skipRight(val));
      },
      [dispatch],
    ),

    /**
     * Toggle skipping right corner shots.
     */
    skipRightCorners: useCallback(
      val => {
        dispatch(skipRightCorners(val));
      },
      [dispatch],
    ),

    /**
     * Set the type of vehicle for flow branching.
     */
    setVehicleType: useCallback(
      type => {
        dispatch(setVehicleType(type));
      },
      [dispatch],
    ),

    /**
     * Extract license plate via AI and store the result.
     * @returns {Promise<any>} AI extraction response
     */
    extractAndSetPlateNumber: useCallback(
      uri => {
        return dispatch(setLicensePlateNumber(uri));
      },
      [dispatch],
    ),

    /**
     * Clear all captured inspection images across all groups.
     */
    clearImages: useCallback(() => {
      dispatch(clearInspectionImages());
    }, [dispatch]),

    /**
     * Set the associated company ID for the inspection.
     */
    setCompany: useCallback(
      id => {
        dispatch(setCompanyId(id));
      },
      [dispatch],
    ),

    /**
     * Set the camera flash mode (on/off/auto).
     */
    setFlash: useCallback(
      mode => {
        dispatch(setFlashMode(mode));
      },
      [dispatch],
    ),

    /**
     * Set validation rules for required files in the inspection.
     */
    setRequired: useCallback(
      required => {
        dispatch(setRequired(required));
      },
      [dispatch],
    ),

    /**
     * Batch update multiple vehicle images in one action.
     */
    batchUpdateImages: useCallback(
      updates => {
        dispatch(batchUpdateVehicleImages(updates));
      },
      [dispatch],
    ),

    /**
     * Set the extracted mileage value.
     */
    setMileage: useCallback(
      mileage => {
        dispatch(setMileage(mileage));
      },
      [dispatch],
    ),

    /**
     * Set user feedback for the inspection.
     */
    setFeedback: useCallback(
      feedback => {
        dispatch(setFeedback(feedback));
      },
      [dispatch],
    ),

    /**
     * Toggle visibility of the mileage input field.
     */
    setMileageVisible: useCallback(
      mileage_visible => {
        dispatch(setMileageVisible(mileage_visible));
      },
      [dispatch],
    ),

    /**
     * Toggle visibility of the license plate number input.
     */
    setPlateNumberVisible: useCallback(
      plateNumber_visible => {
        dispatch(setPlateNumberVisible(plateNumber_visible));
      },
      [dispatch],
    ),

    /**
     * Trigger a check of the tire status based on uploaded photos.
     */
    setTriggerTireStatusCheck: useCallback(
      checkTireStatus => {
        dispatch(setTriggerTireStatusCheck(checkTireStatus));
      },
      [dispatch],
    ),

    /**
     * Set validation or informational message for mileage.
     */
    setMileageMessage: useCallback(
      message => {
        dispatch(setMileageMessage(message));
      },
      [dispatch],
    ),

    /**
     * Extract mileage from an image using AI.
     * @returns {Promise<any>} AI extraction response
     */
    extractMileage: useCallback(
      image_url => {
        return dispatch(getMileage(image_url));
      },
      [dispatch],
    ),

    /**
     * Store captured image dimensions for layout or validation.
     */
    setImageDimensions: useCallback(
      dimensions => {
        dispatch(setImageDimensions(dimensions));
      },
      [dispatch],
    ),
  };
};

export default useNewInspectionActions;
