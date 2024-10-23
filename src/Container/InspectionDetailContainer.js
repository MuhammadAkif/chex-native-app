import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';

import {InspectionDetailScreen} from '../Screens';
import {HARDWARE_BACK_PRESS, S3_BUCKET_BASEURL} from '../Constants';
import {CrossFilled, Tick} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {formatTitle} from '../Utils/helpers';

const STATUS_ICON = {
  true: Tick,
  false: CrossFilled,
};
const {deepGreen, red} = colors;

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
    true: deepGreen,
    false: red,
  };
  const ICON_COMPONENT = STATUS_ICON[isPassed];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
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
    let title = formatTitle(item?.category);
    const checkVideo = {
      'video/mp4': true,
      '.mp4': true,
    };
    const mediaUrl = {
      true: S3_BUCKET_BASEURL + item?.url,
      false: item?.url,
    };
    let currentMediaUrl = mediaUrl[item?.url.split('/')[0] === 'uploads'];
    const isVideo = checkVideo[item?.extension] || false;
    setModalDetails({
      source: currentMediaUrl,
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
