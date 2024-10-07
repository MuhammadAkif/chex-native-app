import React, {useEffect, useMemo, useState} from 'react';
import {BackHandler} from 'react-native';

import {InspectionDetailScreen} from '../Screens';
import {
  HARDWARE_BACK_PRESS,
  INSPECTION_TITLE,
  S3_BUCKET_BASEURL,
} from '../Constants';
import {assignNumber} from '../Utils';
import {CrossFilled, Tick} from '../Assets/Icons';
import {colors} from '../Assets/Styles';

const STATUS_ICON = {
  true: Tick,
  false: CrossFilled,
};

const InspectionDetailContainer = ({navigation, route}) => {
  const {canGoBack, goBack} = navigation;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  let detailsFiles = [];
  if (route?.params) {
    let {files, finalStatus, remarks} = route.params;
    detailsFiles = {files: files, finalStatus: finalStatus, remarks: remarks};
  }
  const isPassed =
    detailsFiles?.finalStatus &&
    detailsFiles?.finalStatus.toLowerCase() === 'pass';
  const ICON_COLOR = {
    true: colors.deepGreen,
    false: colors.red,
  };
  const ICON_COMPONENT = STATUS_ICON[isPassed];
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  // useEffect(() => {
  //   assignNumber(detailsFiles.files, detailsFiles.files.length);
  //   console.log('detailsFiles.files -- ', detailsFiles.files);
  // }, [detailsFiles]);
  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
      return true;
    }
    return false;
  }
  const handleDisplayMedia = item => {
    let title = INSPECTION_TITLE[item?.category] || 'No Title';
    const checkVideo = {
      'video/mp4': true,
      '.mp4': true,
    };
    let mediaURL =
      item?.url.split('/')[0] === 'uploads'
        ? S3_BUCKET_BASEURL + item?.url
        : item?.url;
    const isVideo = checkVideo[item?.extension] || false;
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
      iconColor={ICON_COLOR[isPassed]}
      ICON_COMPONENT={ICON_COMPONENT}
      isPassed={isPassed}
    />
  );
};

export default InspectionDetailContainer;
