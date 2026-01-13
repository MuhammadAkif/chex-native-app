import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import InputModal from './InputModal';
import { setPlateNumberVisible } from '../../Store/Actions';

const LicensePlateInput = () => {
  const { t } = useTranslation();
  const onSubmit = useCallback(async licensePlate => { }, []);

  return (
    <InputModal
      visibleKey="plateNumber"
      valueKey="plateNumber"
      title={t('confirmVehicleDetail.title')}
      description={t('confirmVehicleDetail.description')}
      actionCreator={setPlateNumberVisible}
    // callback={onSubmit}
    />
  );
};

export default memo(LicensePlateInput);
