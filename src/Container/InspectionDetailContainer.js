import React, {useEffect, useMemo, useState} from 'react';
import {BackHandler} from 'react-native';

import {InspectionDetailScreen} from '../Screens';
import {
  HARDWARE_BACK_PRESS,
  INSPECTION_TITLE,
  S3_BUCKET_BASEURL,
} from '../Constants';
import {assignNumber} from '../Utils';

const InspectionDetailContainer = ({navigation, route}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  let detailsFiles = [];
  if (route?.params) {
    let {files, finalStatus, remarks} = route.params;
    detailsFiles = {files: files, finalStatus: finalStatus, remarks: remarks};
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    assignNumber(detailsFiles.files, detailsFiles.files.length);
    console.log('detailsFiles.files -- ', detailsFiles.files);
  }, [detailsFiles]);
  function handle_Hardware_Back_Press() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  }
  const handleDisplayMedia = item => {
    let title = INSPECTION_TITLE[item?.category] || 'No Title';
    let mediaURL =
      item?.url.split('/')[0] === 'uploads'
        ? `${S3_BUCKET_BASEURL}${item?.url}`
        : item?.url;
    const isVideo =
      item?.extension === 'video/mp4' || item?.extension === '.mp4';
    setModalDetails({
      source: mediaURL,
      title: title,
      isVideo: isVideo,
    });
    setIsModalVisible(true);
  };
  const handleDisplayMediaCrossPress = () => {
    setIsModalVisible(false);
    setModalDetails({});
  };

  return (
    <InspectionDetailScreen
      detailsFiles={detailsFiles?.files}
      finalStatus={detailsFiles?.finalStatus}
      remarks={detailsFiles?.remarks}
      isModalVisible={isModalVisible}
      modalDetails={modalDetails}
      handleDisplayMedia={handleDisplayMedia}
      handleDisplayMediaCrossPress={handleDisplayMediaCrossPress}
    />
  );
};

export default InspectionDetailContainer;
