import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearNewInspection, file_Details, setSelectedVehicleKind, setVehicleType,setInspectionFrequency } from '../Store/Actions';
import { handle_Session_Expired } from '../Utils';
import { ROUTES } from '../Navigation/ROUTES';
import { VEHICLE_TYPES } from '../Constants';

const { NEW_INSPECTION, INSPECTION_IN_PROGRESS } = ROUTES;

export const useContinueInspection = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [activeInspectionId, setActiveInspectionId] = useState(null);

    const handleContinuePress = async (inspectionId, onSuccess) => {
        if (!inspectionId) {return;}

        setIsLoading(true);
        setActiveInspectionId(inspectionId);
        try {
            const res = await dispatch(file_Details(inspectionId));
            const { hasAdded = 'existing', vehicleType: vehicleKind, inspection,configs } = res?.data || {};
            const vehicleType = hasAdded || 'existing';
            dispatch(setVehicleType(vehicleType));
            dispatch(setSelectedVehicleKind(vehicleKind));
            dispatch(setInspectionFrequency(configs));
            // Execute success callback if provided (for local cleanup)
            if (onSuccess) {onSuccess();}
            if (vehicleKind === VEHICLE_TYPES.DVIR_TRUCK && inspection?.hasCheckList) {
                navigation.navigate(ROUTES.DVIR_INSPECTION_CHECKLIST, {
                    routeName: ROUTES.DVIR_INSPECTION_CHECKLIST,
                });
            } else {
                navigation.navigate(NEW_INSPECTION, {
                    routeName: INSPECTION_IN_PROGRESS,
                });
            }
        } catch (error) {
            const { statusCode = null } = error?.response?.data || {};
            dispatch(clearNewInspection());
            if (statusCode === 401) {
                handle_Session_Expired(statusCode, dispatch);
            }
            console.log('Error continuing inspection:', error);
        } finally {
            setIsLoading(false);
            setActiveInspectionId(null);
        }
    };

    return { handleContinuePress, isLoading, activeInspectionId };
};

export default useContinueInspection;
