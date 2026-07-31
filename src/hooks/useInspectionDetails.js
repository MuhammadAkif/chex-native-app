import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../Navigation/ROUTES';
import { FILTER_IMAGES, handle_Session_Expired, sortInspectionReviewedItems, updateFiles } from '../Utils';
import { inspectionDetails } from '../services/inspection';

export const useInspectionDetails = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInspectionId, setSelectedInspectionId] = useState(null);

    const handleInspectionDetailsPress = async (inspectionID, onSuccess) => {
        setIsLoading(true);
        setSelectedInspectionId(inspectionID);

        try {
            const res = await inspectionDetails(inspectionID);
            const { inspectionData = null, files = {} } = res?.data || {};

            const { finalStatus, remarks, aiSummary } = inspectionData;
            const beforeImages = FILTER_IMAGES(files, 'before');
            const updatedBeforeImages = updateFiles(beforeImages);
            let files_ = sortInspectionReviewedItems(updatedBeforeImages);

            if (onSuccess) {onSuccess();}
            navigation.navigate(ROUTES.INSPECTION_DETAIL, {
                files: files_,
                finalStatus: finalStatus,
                remarks: remarks,
                aiSummary:aiSummary,
            });
        } catch (error) {
            const { statusCode = null } = error?.response?.data || {};
            if (statusCode === 401) {
                handle_Session_Expired(statusCode, dispatch);
            }
        } finally {
            setIsLoading(false);
            setSelectedInspectionId(null);
        }
    };

    return { handleInspectionDetailsPress, isLoading, selectedInspectionId };
};

export default useInspectionDetails;
