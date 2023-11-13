import React from 'react';

import {InspectionDetailScreen} from '../Screens';

const InspectionDetailContainer = ({route}) => {
  let detailsFiles = [];
  if (route?.params) {
    let {files} = route.params;
    detailsFiles = files;
  }
  return <InspectionDetailScreen detailsFiles={detailsFiles} />;
};

export default InspectionDetailContainer;
