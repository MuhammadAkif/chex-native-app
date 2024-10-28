import {
  updateVehicleImage,
  removeVehicleImage,
  numberPlateSelected,
  updateIsLicensePlateUploaded,
  categoryVariant,
  fileDetails,
  clearNewInspection,
  clearTires,
  skipLeft,
  skipLeftCorners,
  skipRight,
  skipRightCorners,
  setVehicleType,
  setLicensePlateNumber,
  clearInspectionImages,
  setCompanyId,
} from './NewInspectionAction';
import {signIn, signOut, sessionExpired} from './AuthAction';
import {
  fetchInspectionReviewed,
  clearInspectionReviewed,
} from './InspectionReviewedAction';
import {
  fetch_InspectionInProgress,
  removeInspectionInProgress,
  clearInspectionInProgress,
} from './InspectionInProgressAction';
import {setLoading, showToast, hideToast} from './UIActions';

export {
  updateVehicleImage,
  removeVehicleImage,
  numberPlateSelected,
  signIn,
  signOut,
  fetchInspectionReviewed,
  clearInspectionReviewed,
  fetch_InspectionInProgress,
  removeInspectionInProgress,
  clearInspectionInProgress,
  updateIsLicensePlateUploaded,
  categoryVariant,
  fileDetails,
  setLoading,
  showToast,
  hideToast,
  clearNewInspection,
  clearTires,
  skipLeft,
  skipLeftCorners,
  skipRight,
  skipRightCorners,
  setVehicleType,
  setLicensePlateNumber,
  clearInspectionImages,
  setCompanyId,
  sessionExpired,
};
