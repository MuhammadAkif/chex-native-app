import {
  updateVehicleImage,
  removeVehicleImage,
  numberPlateSelected,
  updateIsLicensePlateUploaded,
  categoryVariant,
  fileDetails,
} from './NewInspectionAction';
import {signIn, signOut} from './AuthAction';
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
};
