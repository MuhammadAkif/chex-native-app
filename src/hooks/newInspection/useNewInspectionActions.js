import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
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
} from '../../Store/Actions';

/**
 * Custom hook to access dispatchable actions for managing a new inspection session.
 *
 * @returns {object} Wrapped inspection-related actions.
 */
const useNewInspectionActions = () => {
  const dispatch = useDispatch();

  return {
    updateImage: useCallback(
      (group, item, uri, id) => {
        dispatch(updateVehicleImage(group, item, uri, id));
      },
      [dispatch],
    ),

    removeImage: useCallback(
      (group, item) => {
        dispatch(removeVehicleImage(group, item));
      },
      [dispatch],
    ),

    selectInspectionID: useCallback(
      id => {
        dispatch(numberPlateSelected(id));
      },
      [dispatch],
    ),

    setLicensePlateUploaded: useCallback(
      status => {
        dispatch(updateIsLicensePlateUploaded(status));
      },
      [dispatch],
    ),

    setCategoryVariant: useCallback(
      variant => {
        dispatch(categoryVariant(variant));
      },
      [dispatch],
    ),

    loadFileDetails: useCallback(
      inspectionId => {
        return dispatch(file_Details(inspectionId));
      },
      [dispatch],
    ),

    resetInspection: useCallback(() => {
      dispatch(clearNewInspection());
    }, [dispatch]),

    clearTires: useCallback(() => {
      dispatch(clear_Tires());
    }, [dispatch]),

    skipLeft: useCallback(
      val => {
        dispatch(skipLeft(val));
      },
      [dispatch],
    ),

    skipLeftCorners: useCallback(
      val => {
        dispatch(skipLeftCorners(val));
      },
      [dispatch],
    ),

    skipRight: useCallback(
      val => {
        dispatch(skipRight(val));
      },
      [dispatch],
    ),

    skipRightCorners: useCallback(
      val => {
        dispatch(skipRightCorners(val));
      },
      [dispatch],
    ),

    setVehicleType: useCallback(
      type => {
        dispatch(setVehicleType(type));
      },
      [dispatch],
    ),

    extractAndSetPlateNumber: useCallback(
      uri => {
        return dispatch(setLicensePlateNumber(uri));
      },
      [dispatch],
    ),

    clearImages: useCallback(() => {
      dispatch(clearInspectionImages());
    }, [dispatch]),

    setCompany: useCallback(
      id => {
        dispatch(setCompanyId(id));
      },
      [dispatch],
    ),

    setFlash: useCallback(
      mode => {
        dispatch(setFlashMode(mode));
      },
      [dispatch],
    ),
  };
};

export default useNewInspectionActions;
