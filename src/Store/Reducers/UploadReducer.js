import { Types } from '../Types';

const initialState = {
    activeUploads: {}, // { localUploadId: { id, status, progress, localUri, remoteUrl, uploadParams } }
};

const UploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.START_UPLOAD: {
            const { id, localUri, uploadParams } = action.payload;
            return {
                ...state,
                activeUploads: {
                    ...state.activeUploads,
                    [id]: {
                        id,
                        status: 'uploading',
                        progress: 0,
                        localUri,
                        remoteUrl: null,
                        uploadParams,
                    },
                },
            };
        }
        case Types.UPDATE_UPLOAD_PROGRESS: {
            const { id, progress } = action.payload;
            if (!state.activeUploads[id]) return state;
            return {
                ...state,
                activeUploads: {
                    ...state.activeUploads,
                    [id]: {
                        ...state.activeUploads[id],
                        progress,
                    },
                },
            };
        }
        case Types.COMPLETE_UPLOAD: {
            const { id, remoteUrl } = action.payload;
            if (!state.activeUploads[id]) return state;
            return {
                ...state,
                activeUploads: {
                    ...state.activeUploads,
                    [id]: {
                        ...state.activeUploads[id],
                        status: 'completed',
                        progress: 100,
                        remoteUrl,
                    },
                },
            };
        }
        case Types.FAIL_UPLOAD: {
            const { id, error } = action.payload;
            if (!state.activeUploads[id]) return state;
            return {
                ...state,
                activeUploads: {
                    ...state.activeUploads,
                    [id]: {
                        ...state.activeUploads[id],
                        status: 'failed',
                        error,
                    },
                },
            };
        }
        case Types.DISMISS_UPLOAD: {
            const { id } = action.payload;
            if (!state.activeUploads[id]) return state;
            const newActiveUploads = { ...state.activeUploads };
            delete newActiveUploads[id];
            return {
                ...state,
                activeUploads: newActiveUploads,
            };
        }
        default:
            return state;
    }
};

export default UploadReducer;
