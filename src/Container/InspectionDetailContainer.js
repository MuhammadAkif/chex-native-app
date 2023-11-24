import React, {useState} from 'react';

import {InspectionDetailScreen} from '../Screens';
import {S3_BUCKET_BASEURL} from '@env';
import {extractTitle} from '../Utils';

const InspectionDetailContainer = ({route}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  let detailsFiles = [];
  if (route?.params) {
    let {files} = route.params;
    detailsFiles = files;
  }
  const handleDisplayMedia = item => {
    let title = extractTitle(item?.groupType, item?.category);
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
      detailsFiles={detailsFiles}
      isModalVisible={isModalVisible}
      modalDetails={modalDetails}
      handleDisplayMedia={handleDisplayMedia}
      handleDisplayMediaCrossPress={handleDisplayMediaCrossPress}
    />
  );
};

export default InspectionDetailContainer;
