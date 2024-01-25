import React, {useState} from 'react';

import {InspectionDetailScreen} from '../Screens';
import {extractTitle} from '../Utils';
import {S3_BUCKET_BASEURL} from '../Constants';
// import {S3_BUCKET_BASEURL} from '@env'

const InspectionDetailContainer = ({route}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  let detailsFiles = [];
  if (route?.params) {
    let {files, finalStatus, remarks} = route.params;
    detailsFiles = {files: files, finalStatus: finalStatus, remarks: remarks};
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
