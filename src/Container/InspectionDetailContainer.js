import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { InspectionDetailScreen } from '../Screens';
import { HARDWARE_BACK_PRESS } from '../Constants';
import { CrossFilled, Tick } from '../Assets/Icons';
import { colors } from '../Assets/Styles';
import { checkAndCompleteUrl, formatTitle } from '../Utils/helpers';
import { useTranslation } from 'react-i18next';

const STATUS_ICON = {
  true: Tick,
  false: CrossFilled,
};
const { deepGreen, red } = colors;

const InspectionDetailContainer = ({ navigation, route }) => {
  const { canGoBack, goBack } = navigation;
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  let detailsFiles = [];
  if (route?.params) {
    let { files, finalStatus, remarks, aiSummary } = route.params;
    detailsFiles = { files: files, finalStatus: finalStatus, remarks: remarks, aiSummary: aiSummary };
  }
  const isPassed = detailsFiles?.finalStatus && detailsFiles?.finalStatus.toLowerCase() === 'pass';
  const ICON_COLOR = {
    true: deepGreen,
    false: red,
  };
  const ICON_COMPONENT = STATUS_ICON[isPassed];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
    return () => backHandler.remove();
  }, []);

  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
      return true;
    }
    return false;
  }
  const handleDisplayMedia = item => {
    let title = t(`inspectionTitles.${item?.category}`);
    console.log('title',title)
    const checkVideo = {
      'video/mp4': true,
      '.mp4': true,
    };
    let { completedUrl: source } = checkAndCompleteUrl(item?.processedUrl || item?.url);
    const isVideo = checkVideo[item?.extension] || false;
    setModalDetails({
      source,
      title,
      isVideo,
      coordinates: item?.coordinateArray?.coordinateArray,
    });
    setIsModalVisible(true);
  };
  const handleDisplayMediaCrossPress = () => {
    setIsModalVisible(false);
    setModalDetails({});
  };
  console.log('detailsFiles',detailsFiles)

  return (
    <InspectionDetailScreen
      detailsFiles={detailsFiles?.files}
      finalStatus={detailsFiles?.finalStatus}
      remarks={detailsFiles?.remarks}
      aiSummary={detailsFiles?.aiSummary}
      isModalVisible={isModalVisible}
      modalDetails={modalDetails}
      handleDisplayMedia={handleDisplayMedia}
      handleDisplayMediaCrossPress={handleDisplayMediaCrossPress}
      iconColor={ICON_COLOR[isPassed]}
      ICON_COMPONENT={ICON_COMPONENT}
      isPassed={isPassed}
    />
  );
};

export default InspectionDetailContainer;
