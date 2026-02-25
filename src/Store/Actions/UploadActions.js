import { Types } from '../Types';
import { getSignedUrl, uploadFile, getCurrentDate, exteriorVariant } from '../../Utils';
import { updateVehicleImage } from './NewInspectionAction';
import { S3_BUCKET_BASEURL } from '../../Constants';

export const startUpload = payload => ({
    type: Types.START_UPLOAD,
    payload,
});

export const updateUploadProgress = (id, progress) => ({
    type: Types.UPDATE_UPLOAD_PROGRESS,
    payload: { id, progress },
});

export const completeUpload = (id, remoteUrl) => ({
    type: Types.COMPLETE_UPLOAD,
    payload: { id, remoteUrl },
});

export const failUpload = (id, error) => ({
    type: Types.FAIL_UPLOAD,
    payload: { id, error },
});

export const dismissUpload = id => ({
    type: Types.DISMISS_UPLOAD,
    payload: { id },
});

export const initiateBackgroundUpload = payload => {
    return async (dispatch, getState) => {
        const {
            id,
            localUri,
            uploadParams,
        } = payload;

        dispatch(startUpload(payload));

        const {
            token,
            mime,
            normalizedPath,
            inspectionId,
            subCategory,
            variant,
            companyId,
            category,
            groupType,
            vehicle_Type,
            haveType,
            type, // needed for updateVehicleImage
        } = uploadParams;

        const setProgress = progress => {
            dispatch(updateUploadProgress(id, progress));
        };

        const handleResponse = async key => {
            let body = {
                category: subCategory,
                url: key,
                extension: mime,
                groupType: groupType,
                dateImage: getCurrentDate(),
                hasAdded: vehicle_Type,
            };
            if (haveType) {
                body = { ...body, variant: variant };
            }
            const image_url = `${S3_BUCKET_BASEURL}${key}`;

            const onSuccessCallback = imageID => {
                // Redux update vehicle image
                let type_ = type;
                if (haveType) {
                    type_ = exteriorVariant(type_, variant);
                }
                dispatch(updateVehicleImage(groupType, type_, image_url, imageID));

                // Mark global upload as complete
                dispatch(completeUpload(id, image_url));
            };

            try {
                await uploadFile(onSuccessCallback, body, inspectionId, token, handleError, dispatch);
            } catch (error) {
                console.log('Background uploadFile error:', error);
                handleError(error);
            }
        };

        const handleError = error => {
            console.log('Background upload error:', error);
            dispatch(failUpload(id, error));
        };

        try {
            await getSignedUrl(
                token,
                mime,
                normalizedPath,
                setProgress,
                handleResponse,
                handleError,
                dispatch,
                inspectionId,
                subCategory,
                variant || 0,
                'app',
                companyId,
                category
            );
        } catch (error) {
            console.log('Background getSignedUrl error:', error);
            handleError(error);
        }
    };
};
