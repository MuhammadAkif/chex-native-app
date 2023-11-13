import React, {useEffect, useState} from 'react';

import {InspectionDetailScreen} from '../Screens';

const InspectionDetailContainer = ({route}) => {
  let detailsFiles = [];
  if (route?.params) {
    let {files} = route.params;
    detailsFiles = files;
  }
  console.log('detailsFiles => ', detailsFiles);
  debugger
  return <InspectionDetailScreen detailsFiles={detailsFiles} />;
};

export default InspectionDetailContainer;
