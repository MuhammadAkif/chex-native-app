import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES} from '../../Assets/Images';
import {INSPECTION} from '../../Constants';
import {ROUTES} from '../../Navigation/ROUTES';
import {DVIRInspectionChecklistScreen} from '../../Screens';
import {getChecklists, removeChecklistImageVideo as removeChecklistImageVideoAPI, updateChecklist} from '../../services/inspection';
import {categoryVariant, setRequired} from '../../Store/Actions';
import {
  ExteriorFrontDetails,
  ExteriorLeftDetails,
  ExteriorRearDetails,
  ExteriorRearLeftCornerDetails,
  ExteriorRearRightCornerDetails,
  ExteriorRightDetails,
  isNotEmpty,
  LicensePlateDetails,
} from '../../Utils';

const frameConfigMap = {
  exteriorFront: {
    details: ExteriorFrontDetails,
    source: IMAGES.truck_exterior_front,
    index: 0,
  },
  exteriorRight: {
    details: ExteriorRightDetails,
    source: IMAGES.truck_exterior_right,
    index: 1,
  },
  exteriorLeft: {
    details: ExteriorLeftDetails,
    source: IMAGES.truck_exterior_left,
    index: 0,
  },
  rearRight: {
    details: ExteriorRearRightCornerDetails,
    source: IMAGES.truck_exterior_rear_right,
    index: 1,
  },
  rearLeft: {
    details: ExteriorRearLeftCornerDetails,
    source: IMAGES.truck_exterior_rear_left,
    index: 0,
  },
  rear: {
    details: ExteriorRearDetails,
    source: IMAGES.truck_exterior_rear_back,
    index: 0,
  },
  frontInterior: {
    source: {
      uri: 'https://i.pinimg.com/736x/6c/3a/90/6c3a90dd5ae3bcc98fc32b28e2408ab8.jpg',
    },
    index: 0,

    details: {
      key: 'frontInterior',
      title: 'Front Interior',
      instructionalText: 'Please take a photo with clear view dashboard',
      instructionalSubHeadingText: 'Front Interior',
      buttonText: 'Capture Now',
      category: 'Interior',
      subCategory: 'front_interior',
      groupType: INSPECTION.interiorItems,
      isVideo: false,
    },
  },
  rearInterior: {
    source: IMAGES.truck_interior_back,
    index: 0,

    details: {
      key: 'rearInterior',
      title: 'Rear Interior',
      instructionalText: 'Please take a photo with clear view of the rear interior',
      instructionalSubHeadingText: 'Rear Interior',
      buttonText: 'Capture Now',
      category: 'Interior',
      subCategory: 'rear_interior',
      groupType: INSPECTION.interiorItems,
      isVideo: false,
    },
  },
  tire: {
    source: IMAGES.tire,
    index: 0,

    details: {
      key: 'tire',
      title: 'Tire',
      instructionalText: 'Please take a photo with clear view of the tire',
      instructionalSubHeadingText: 'Tire',
      buttonText: 'Capture Now',
      category: 'Tire',
      subCategory: '', // Dynamically
      groupType: INSPECTION.tires,
      isVideo: false,
    },
  },
};

const DVIRInspectionChecklistContainer = ({navigation, route}) => {
  // State for checklist items
  const [commentModalVisible, setAddCommentModalVisible] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [additionalComments, setAdditionalComments] = useState('');
  const {selectedInspectionID} = useSelector(state => state.newInspection) || {};

  const [checklistData, setChecklistData] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [captureFrames, setCaptureFrames] = useState([
    {
      id: 10,
      title: 'Exterior Front',
      frames: [
        {id: 'exteriorRight', image: IMAGES.truckRight},
        {id: 'exteriorLeft', image: IMAGES.truckLeft},
        {id: 'exteriorFront', image: IMAGES.truckFront},
      ],
    },
    {
      id: 11,
      title: 'Exterior Rear',
      frames: [
        {id: 'rearRight', image: IMAGES.truckRearRight},
        {id: 'rearLeft', image: IMAGES.truckRearLeft},
        {id: 'rear', image: IMAGES.truckBack},
      ],
    },
    {
      id: 12,
      title: 'Full Front Interior (dash, steering wheel, Seat)',
      frames: [{id: 'frontInterior', image: IMAGES.truckInterior}],
    },
    {
      id: 13,
      title: 'Rear Interior (back seats, floor) / Truck Bed',
      frames: [{id: 'rearInterior', image: IMAGES.truckInterior}],
    },
  ]);

  const [tireInspectionData, setTireInspectionData] = useState([
    {
      id: 'tdrf',
      title: 'Tread Depth RF (TDRF)',
      image: null,
      icon: 'vehicleTire',
    },
    {
      id: 'tdrr',
      title: 'Tread Depth RR (TDRR)',
      image: null,
      icon: 'vehicleTire',
    },
    {
      id: 'tdlf',
      title: 'Tread Depth LF (TDLF)',
      image: null,
      icon: 'vehicleTire',
    },
    {
      id: 'tdlr',
      title: 'Tread Depth LR (TDLR)',
      image: null,
      icon: 'vehicleTire',
    },
    {
      id: 'tdspare',
      title: 'Tread Depth Spare (TDSPARE)',
      image: null,
      icon: 'vehicleTDS',
    },
    {
      id: 'brake_components',
      title: 'Brake Components (photo of drums/rotors/lines)',
      image: null,
      icon: 'vehicleBrakeComponent',
    },
  ]);

  // Section toggle state
  const [showChecklistSection, setShowChecklistSection] = useState(true);
  const [showTiresSection, setShowTiresSection] = useState(true);

  const toggleChecklistSection = useCallback(() => {
    setShowChecklistSection(prev => !prev);
  }, []);

  const toggleTiresSection = useCallback(() => {
    setShowTiresSection(prev => !prev);
  }, []);

  // Memoize button styles to avoid recalculation
  const buttonStyles = useMemo(
    () => ({
      Good: {
        backgroundColor: '#20C18D',
        textColor: '#FFFFFF',
      },
      Repair: {
        backgroundColor: '#FFC700',
        textColor: '#FFFFFF',
      },
      Replace: {
        backgroundColor: '#F74F4F',
        textColor: '#FFFFFF',
      },
      default: {
        backgroundColor: '#F4F6F6',
        textColor: '#666666',
      },
    }),
    [],
  );

  const updateChecklistAPIWithCardIndex = useCallback(
    (cardIndex, data) => {
      updateChecklist(selectedInspectionID, checklistData?.[cardIndex]?.checkId, data);
    },
    [updateChecklist, selectedInspectionID, checklistData],
  );

  const handleChecklistStatusChange = useCallback(
    (option, cardIndex, optionIndex) => {
      setChecklistData(prevData => {
        const newData = [...prevData];
        newData[cardIndex].checkStatus = option;
        return newData;
      });

      updateChecklistAPIWithCardIndex(cardIndex, {
        checkStatus: option,
      });
    },
    [updateChecklistAPIWithCardIndex],
  );

  const handleAddComment = useCallback(index => {
    setCurrentItemIndex(index);
    setAddCommentModalVisible(true);
  }, []);

  const handleSaveComment = useCallback(
    comments => {
      if (currentItemIndex !== null) {
        setChecklistData(prevData => {
          const newData = [...prevData];
          newData[currentItemIndex].comment = comments;
          return newData;
        });
      }
      if (comments) {
        // UPDATE CHECKLIST API
        updateChecklistAPIWithCardIndex(currentItemIndex, {
          comment: comments,
        });
      }

      setAddCommentModalVisible(false);
      setCurrentItemIndex(null);
    },
    [currentItemIndex],
  );

  const handleChecklistOpenCamera = useCallback(
    (index, isVideo) => {
      const details = {
        title: isVideo ? 'Upload Video' : 'Upload Image',
        type: '1',
        uri: '',
        source: '',
        fileId: '',
        instructionalText: `Please wait a while the ${isVideo ? 'video' : 'image'} is being uploaded`,
      };

      navigation.navigate(isVideo ? ROUTES.VIDEO : ROUTES.CAMERA, {
        type: 1,
        modalDetails: details,
        inspectionId: selectedInspectionID,
        returnTo: ROUTES.DVIR_INSPECTION_CHECKLIST,
        returnToParams: {checklistCardIndex: index},
      });
    },
    [navigation, checklistData],
  );

  const handleCloseAddCommentModal = useCallback(() => {
    setAddCommentModalVisible(false);
  }, []);

  const handleCheckItemRemoveImage = useCallback(
    (itemIndex, imageIndex) => {
      setChecklistData(prevData => {
        const newData = [...prevData];

        const item = newData[itemIndex];
        const imageToRemove = item?.url?.[imageIndex];

        // Remove image from images array
        if (item && imageToRemove) {
          newData[itemIndex] = {
            ...item,
            url: item.url.filter((_, i) => i !== imageIndex),
          };

          // Trigger API removal using checkId and image URL
          removeChecklistImageVideoAPI(selectedInspectionID, item.checkId, {
            url: imageToRemove,
          });
        }

        return newData;
      });
    },
    [removeChecklistImageVideoAPI, selectedInspectionID],
  );

  // Handler to update tire image
  const handlePressTireImage = tireId => {
    handleFramePickerPress(
      {...frameConfigMap.tire, ...frameConfigMap.tire.details, subCategory: tireId, afterFileUploadNavigationParams: {tireId}},
      0,
    );
  };

  // CAPTURE MODAL DETAILS
  const modalDetailsInitialState = {
    ...LicensePlateDetails,
    isVideo: false,
  };
  const [modalDetails, setModalDetails] = useState(modalDetailsInitialState);
  const [displayAnnotationPopUp, setDisplayAnnotationPopUp] = useState(false);
  const [captureImageModalVisible, setCaptureImageModalVisible] = useState(false);
  const [requiredFields, setRequiredFields] = useState({});
  const dispatch = useDispatch();
  const [annotationModalDetails, setAnnotationModalDetails] = useState({
    title: '',
    type: '',
    uri: '',
    fileId: '',
    source: '',
  });

  const handleFramePickerPress = (details, variant = 0) => {
    const haveType = checkCategory(details.category || null);
    displayAnnotationPopUp && setDisplayAnnotationPopUp(false);
    dispatch(categoryVariant(variant));
    if (haveType) {
      const {key} = details;
      const isRequired = isNotEmpty(requiredFields[key]);
      toggleFieldRequired(!isRequired);
    } else {
      toggleFieldRequired(true);
    }

    setModalDetails(details);
    setCaptureImageModalVisible(true);
  };

  const handleCaptureNowPress = (isVideo, key) => {
    const paths = {
      true: ROUTES.VIDEO,
      false: ROUTES.CAMERA,
    };
    const path = paths[isVideo];
    const details = {
      title: modalDetails.title,
      type: key,
      uri: '',
      source: modalDetails.source,
      fileId: '',
    };

    setAnnotationModalDetails(details);
    setCaptureImageModalVisible(false);
    setModalDetails(modalDetailsInitialState);

    navigation.navigate(path, {
      type: key,
      modalDetails: modalDetails,
      inspectionId: selectedInspectionID,
    });
  };

  function checkCategory(category) {
    const types = ['Interior', 'Exterior'];
    return types.includes(category);
  }

  function toggleFieldRequired(required = null) {
    dispatch(setRequired(required));
  }

  const handleCaptureFrame = (captureFrameId, frameId) => {
    const config = frameConfigMap[frameId];
    handleFramePickerPress({...config.details, source: config.source, afterFileUploadNavigationParams: {captureFrameId, frameId}}, config.index);
  };

  // CAPTURE MODAL DETAILS
  const getChecklistsData = useCallback(async () => {
    setChecklistLoading(true);
    const response = await getChecklists(selectedInspectionID);
    setChecklistLoading(false);
    console.log(response?.data);
    if (response.status == 200 && response?.data?.length > 0) setChecklistData(response.data);
  }, []);

  // Camera result handler
  useEffect(() => {
    if (route?.params?.capturedImageUri) {
      if (route?.params?.checklistCardIndex !== undefined) {
        const {checklistCardIndex, capturedImageUri, capturedImageMime} = route.params;

        setChecklistData(prevData =>
          prevData.map((item, idx) =>
            idx === checklistCardIndex
              ? {
                  ...item,
                  url: [...(item.url || []), capturedImageUri],
                }
              : item,
          ),
        );

        updateChecklistAPIWithCardIndex(checklistCardIndex, {
          url: capturedImageUri,
          extension: capturedImageMime,
        });
      }

      navigation.setParams({
        checklistCardIndex: undefined,
        capturedImageUri: undefined,
        capturedImageMime: undefined,
      });
    }
  }, [route?.params?.capturedImageUri]);

  useEffect(() => {
    if (route?.params?.afterFileUploadImageUrl) {
      const {captureFrameId, frameId, afterFileUploadImageUrl, tireId} = route.params;

      if (captureFrameId && frameId) {
        const updatedFrames = captureFrames.map(item => {
          if (item.id === captureFrameId) {
            return {
              ...item,
              frames: item.frames.map(frame => (frame.id === frameId ? {...frame, image: afterFileUploadImageUrl} : frame)),
            };
          }
          return item;
        });

        setCaptureFrames(updatedFrames);
      } else if (tireId) {
        setTireInspectionData(prevData => prevData.map(tire => (tire.id === tireId ? {...tire, image: afterFileUploadImageUrl} : tire)));
      }

      navigation.setParams({
        afterFileUploadImageUrl: undefined,
        tireId: undefined,
        captureFrameId: undefined,
        frameId: undefined,
      });
    }
  }, [route?.params?.afterFileUploadImageUrl]);

  useEffect(() => {
    getChecklistsData();
  }, []);

  return (
    <DVIRInspectionChecklistScreen
      navigation={navigation}
      route={route}
      addCommentModalVisible={commentModalVisible}
      currentItemIndex={currentItemIndex}
      setCurrentItemIndex={setCurrentItemIndex}
      additionalComments={additionalComments}
      setAdditionalComments={setAdditionalComments}
      checklistData={checklistData}
      checklistLoading={checklistLoading}
      setChecklistData={setChecklistData}
      captureFrames={captureFrames}
      setCaptureFrames={setCaptureFrames}
      tireInspectionData={tireInspectionData}
      setTireInspectionData={setTireInspectionData}
      buttonStyles={buttonStyles}
      onChecklistStatusChange={handleChecklistStatusChange}
      onCommentIconPress={handleAddComment}
      onSaveComment={handleSaveComment}
      onCheckItemCameraIconPress={handleChecklistOpenCamera}
      handleCloseModal={handleCloseAddCommentModal}
      onCheckItemRemoveImage={handleCheckItemRemoveImage}
      onPressTireImage={handlePressTireImage}
      showChecklistSection={showChecklistSection}
      showTiresSection={showTiresSection}
      toggleChecklistSection={toggleChecklistSection}
      toggleTiresSection={toggleTiresSection}
      onPressCaptureFrame={handleCaptureFrame}
      commentModalImage={checklistData?.[currentItemIndex]?.fileType == 'photo' ? checklistData?.[currentItemIndex]?.url?.[0] : null}
      // CAPTURE MODAL DETAILS PROPS
      captureImageModalVisible={captureImageModalVisible}
      setCaptureImageModalVisible={() => setCaptureImageModalVisible(false)}
      source={modalDetails?.source}
      instructionalText={modalDetails?.instructionalText}
      buttonText={modalDetails?.buttonText}
      title={modalDetails?.title}
      isVideo={modalDetails?.isVideo}
      modalKey={modalDetails?.key}
      isExterior={modalDetails?.groupType === INSPECTION.exteriorItems}
      isInterior={modalDetails?.groupType === INSPECTION.interiorItems}
      isCarVerification={modalDetails?.groupType === INSPECTION.carVerificiationItems}
      instructionalSubHeadingText={modalDetails?.instructionalSubHeadingText}
      instructionalSubHeadingText_1={modalDetails?.instructionalSubHeadingText_1}
      instructionalSubHeadingText_2={modalDetails?.instructionalSubHeadingText_2}
      handleFramesCaptureImage={handleCaptureNowPress}
      // CAPTURE MODAL DETAILS PROPS
    />
  );
};

export default DVIRInspectionChecklistContainer;
