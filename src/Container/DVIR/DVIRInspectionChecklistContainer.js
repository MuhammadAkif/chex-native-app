import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES} from '../../Assets/Images';
import {INSPECTION, S3_BUCKET_BASEURL} from '../../Constants';
import {ROUTES} from '../../Navigation/ROUTES';
import {DVIRInspectionChecklistScreen} from '../../Screens';
import {
  deleteImageFromDatabase,
  getChecklists,
  getInspectionDetails,
  inspectionSubmission,
  removeChecklistImageVideo as removeChecklistImageVideoAPI,
  updateChecklist,
} from '../../services/inspection';
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
import {useFocusEffect, useIsFocused, useNavigationState, usePreventRemove} from '@react-navigation/native';
import {BackHandler} from 'react-native';

const frameConfigMap = {
  exterior_front: {
    details: ExteriorFrontDetails,
    source: IMAGES.truck_exterior_front,
    index: 0,
  },
  exterior_right: {
    details: ExteriorRightDetails,
    source: IMAGES.truck_exterior_right,
    index: 1,
  },
  exterior_left: {
    details: ExteriorLeftDetails,
    source: IMAGES.truck_exterior_left,
    index: 0,
  },
  rear_right_corner: {
    details: ExteriorRearRightCornerDetails,
    source: IMAGES.truck_exterior_rear_right,
    index: 1,
  },
  rear_left_corner: {
    details: ExteriorRearLeftCornerDetails,
    source: IMAGES.truck_exterior_rear_left,
    index: 0,
  },
  exterior_rear: {
    details: ExteriorRearDetails,
    source: IMAGES.truck_exterior_rear_back,
    index: 0,
  },
  front_interior: {
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
  rear_interior: {
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
      instructionalSubHeadingText: '',
      buttonText: 'Capture Now',
      category: 'Tire',
      subCategory: '', // Dynamically
      groupType: INSPECTION.tires,
      isVideo: false,
    },
  },
};

// Helpers to centralize initial state
const getInitialCaptureFrames = () => [
  {
    id: 'exterior_front',
    title: 'Exterior Front',
    frames: [
      {id: 'exterior_right', icon: IMAGES.truckRight, image: null},
      {id: 'exterior_left', icon: IMAGES.truckLeft, image: null},
      {id: 'exterior_front', icon: IMAGES.truckFront, image: null},
    ],
  },
  {
    id: 'exterior_rear',
    title: 'Exterior Rear',
    frames: [
      {id: 'rear_right_corner', icon: IMAGES.truckRearRight, image: null},
      {id: 'rear_left_corner', icon: IMAGES.truckRearLeft, image: null},
      {id: 'exterior_rear', icon: IMAGES.truckBack, image: null},
    ],
  },
  {
    id: 'interior_front',
    title: 'Full Front Interior (dash, steering wheel, Seat)',
    frames: [{id: 'front_interior', icon: IMAGES.truckInterior, image: null}],
  },
  {
    id: 'interior_rear',
    title: 'Rear Interior (back seats, floor) / Truck Bed',
    frames: [{id: 'rear_interior', icon: IMAGES.truckInterior, image: null}],
  },
];

const getInitialTireInspectionData = () => [
  {id: 'tdrf', title: 'Tread Depth RF (TDRF)', image: null, icon: 'vehicleTire'},
  {id: 'tdrr', title: 'Tread Depth RR (TDRR)', image: null, icon: 'vehicleTire'},
  {id: 'tdlf', title: 'Tread Depth LF (TDLF)', image: null, icon: 'vehicleTire'},
  {id: 'tdlr', title: 'Tread Depth LR (TDLR)', image: null, icon: 'vehicleTire'},
  {id: 'tdspare', title: 'Tread Depth Spare (TDSPARE)', image: null, icon: 'vehicleTDS'},
  {
    id: 'brake_components',
    title: 'Brake Components (photo of drums/rotors/lines)',
    image: null,
    icon: 'vehicleBrakeComponent',
  },
];

const DVIRInspectionChecklistContainer = ({navigation, route}) => {
  const {selectedInspectionID} = useSelector(state => state.newInspection);

  // State for checklist items
  const [commentModalVisible, setAddCommentModalVisible] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [additionalComments, setAdditionalComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checklistData, setChecklistData] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [mediaModalDetails, setMediaModalDetails] = useState({});
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [captureFrames, setCaptureFrames] = useState(getInitialCaptureFrames());

  const [tireInspectionData, setTireInspectionData] = useState(getInitialTireInspectionData());

  // Section toggle state
  const [showChecklistSection, setShowChecklistSection] = useState(false);
  const [showTiresSection, setShowTiresSection] = useState(false);
  const routes = useNavigationState(state => state.routes);

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
  // const [annotationModalDetails, setAnnotationModalDetails] = useState({
  //   title: '',
  //   type: '',
  //   uri: '',
  //   fileId: '',
  //   source: '',
  // });

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
      if (checklistData?.[index]?.url?.length == 5) return alert('You can add a maximum of 5 media files');

      const details = {
        title: isVideo ? 'Upload Video' : 'Upload Image',
        type: '1',
        uri: '',
        source: '',
        fileId: '',
        instructionalText: `Please wait a while the ${isVideo ? 'video' : 'image'} is being uploaded`,
      };

      dispatch(setRequired(false));
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
  const handlePressTireImage = (tireId, title) => {
    handleFramePickerPress(
      {
        ...frameConfigMap.tire,
        ...frameConfigMap.tire.details,
        title,
        subCategory: tireId,
        afterFileUploadNavigationParams: {tireId},
      },
      0,
    );
  };

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
    // const details = {
    //   title: modalDetails.title,
    //   type: key,
    //   uri: '',
    //   source: modalDetails.source,
    //   fileId: '',
    // };

    // setAnnotationModalDetails(details);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    await inspectionSubmission(selectedInspectionID);
    setIsLoading(false);

    navigation.navigate(ROUTES.INSPECTION_SELECTION);
  };

  const handleMediaModalDetailsCrossPress = () => {
    setMediaModalVisible(false);
    setMediaModalDetails({});
  };

  const handleRemoveFrameImage = (itemId, frameId, fileId, type) => {
    // WE HAVE TO MAKE IMAGE KEY NULL FOR THE FRAME AND UPDATE THE API

    if (type === 'capture_frames') {
      setCaptureFrames(prevFrames =>
        prevFrames.map(frame =>
          frame.id === itemId ? {...frame, frames: frame.frames.map(f => (f.id === frameId ? {...f, image: null, fileId: null} : f))} : frame,
        ),
      );
    } else if (type === 'tires') {
      // DELETION FOR TIRES
      setTireInspectionData(prevTires => prevTires.map(tire => (tire.id === itemId ? {...tire, image: null, fileId: null} : tire)));
    }

    // API TO DELETE FROM DATABASE
    deleteImageFromDatabase(fileId)
      .then(() => console.log('file deleted:', fileId))
      .catch(e => console.log('file not deleted', e));
  };

  const handleMediaModalDetailsPress = (item, type, checkMediaIdx) => {
    if (type == 'checklist') {
      setMediaModalDetails({
        title: item?.name,
        source: item?.url?.[checkMediaIdx],
        isVideo: item?.fileType == 'video',
        coordinates: [],
      });
    } else if (type == 'capture_frame') {
      // const coordinates = extractCoordinates(fileDetails, image_ID);
      setMediaModalDetails({
        title: frameConfigMap?.[item?.id]?.details?.title,
        source: item?.image,
        isVideo: false,
        coordinates: [],
      });
    } else if (type == 'tire') {
      setMediaModalDetails({
        title: item?.title,
        source: item?.image,
        isVideo: false,
        coordinates: [],
      });
    }

    if (type) setMediaModalVisible(true);
  };

  const resetState = useCallback(() => {
    setAddCommentModalVisible(false);
    setCurrentItemIndex(null);
    setAdditionalComments('');
    setIsLoading(false);
    setChecklistData([]);
    setMediaModalVisible(false);
    setMediaModalDetails({});
    setChecklistLoading(false);
    setCaptureFrames(getInitialCaptureFrames());
    setTireInspectionData(getInitialTireInspectionData());
    setModalDetails(modalDetailsInitialState);
    setDisplayAnnotationPopUp(false);
    setCaptureImageModalVisible(false);
    setRequiredFields({});
    setShowChecklistSection(false);
  }, []);

  //API CALLS
  const getChecklistsData = useCallback(async () => {
    setChecklistLoading(true);
    const response = await getChecklists(selectedInspectionID);
    setChecklistLoading(false);

    if (response.status == 200 && response?.data?.length > 0) {
      setChecklistData(response.data);
      setShowChecklistSection(true);
    }
  }, [selectedInspectionID]);

  const getInspectionData = useCallback(async () => {
    const response = await getInspectionDetails(selectedInspectionID);
    const files = response?.data?.files || [];

    if (files.length > 0) {
      // ----- TIRES -----
      const tiresFiles = files.filter(file => file.groupType === 'tires');
      if (tiresFiles.length > 0) {
        const updatedTires = tireInspectionData.map(tire => {
          const matchedFile = tiresFiles.find(file => file.category === tire.id);
          if (matchedFile) {
            return {
              ...tire,
              image: S3_BUCKET_BASEURL + matchedFile.url,
              fileId: matchedFile.id,
            };
          }
          return tire;
        });

        setTireInspectionData(updatedTires);
      }

      // ----- EXTERIOR & INTERIOR ITEMS -----
      const exteriorItemsFiles = files.filter(file => file.groupType === 'exteriorItems');
      const interiorItemsFiles = files.filter(file => file.groupType === 'interiorItems');

      const allItemFiles = [...exteriorItemsFiles, ...interiorItemsFiles];

      if (allItemFiles.length > 0) {
        const updatedCaptureFrames = captureFrames.map(section => {
          const updatedFrames = section.frames.map(frame => {
            const matchedFile = allItemFiles.find(file => file.category === frame.id);
            if (matchedFile) {
              return {
                ...frame,
                image: S3_BUCKET_BASEURL + matchedFile.url,
                fileId: matchedFile.id,
              };
            }
            return frame;
          });

          return {
            ...section,
            frames: updatedFrames,
          };
        });

        setCaptureFrames(updatedCaptureFrames);
      }
    }
  }, [selectedInspectionID, tireInspectionData, captureFrames]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setParams({hasNewFetch: undefined});
      };
    }, []),
  );

  // CHECKLIST Camera result handler
  useEffect(() => {
    if (route?.params?.capturedImageUri) {
      if (route?.params?.checklistCardIndex !== undefined) {
        const {checklistCardIndex, capturedImageUri, capturedImageMime, localPath} = route.params;

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
      const {captureFrameId, frameId, afterFileUploadImageUrl, tireId, fileId} = route.params;

      // CAPTURE FRAMES
      if (captureFrameId && frameId) {
        const updatedFrames = captureFrames.map(item => {
          if (item.id === captureFrameId) {
            return {
              ...item,
              frames: item.frames.map(frame => (frame.id === frameId ? {...frame, image: afterFileUploadImageUrl, fileId} : frame)),
            };
          }
          return item;
        });

        setCaptureFrames(updatedFrames);

        // TIRES
      } else if (tireId) {
        setTireInspectionData(prevData => prevData.map(tire => (tire.id === tireId ? {...tire, image: afterFileUploadImageUrl, fileId} : tire)));
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
    if (!selectedInspectionID) return;
    if (!route?.params?.hasNewFetch) return;
    // Reset all local states to initial values
    resetState();

    const fetchData = async () => {
      try {
        await Promise.all([getChecklistsData(), getInspectionData()]);
      } catch (error) {
        console.error('Failed to fetch checklist or inspection data:', error.response?.data || error);
      }
    };

    fetchData();
  }, [selectedInspectionID, route?.params?.hasNewFetch]);

  const validateFramesTiresCheclist = () => {
    // 1. Validate captureFrames: all frames must have a non-null image
    const allFramesHaveImages = captureFrames.every(section => section.frames.every(frame => frame.image !== null));

    // 2. Validate tires: all tires must have a non-null image
    const allTiresHaveImages = tireInspectionData.every(tire => tire.image !== null);

    // 3. Validate checklist: all items must have a non-empty checkStatus
    const allChecklistItemsHaveStatus = checklistData?.every?.(item => item?.checkStatus !== null);

    // Final result
    const allResults = allFramesHaveImages && allTiresHaveImages && allChecklistItemsHaveStatus;

    return {
      allResults,
      allFramesHaveImages,
      allTiresHaveImages,
      allChecklistItemsHaveStatus,
    };
  };

  // Custom back handler
  const customGoBack = useCallback(() => {
    const navState = navigation.getState();
    const routes = navState.history;

    // Get previousOne and previousTwo
    const previousOne = routes[routes.length - 2];

    if (previousOne && previousOne.key.includes(ROUTES.NEW_INSPECTION)) {
      navigation.navigate(ROUTES.INSPECTION_SELECTION);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Optionally exit app or do nothing
    }
    return true; // Prevent default
  }, [navigation]);

  // Handle hardware back
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => customGoBack();
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [customGoBack]),
  );

  // Pass customGoBack to header or use it in UI as needed

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
      hasSubmitButtonShow={validateFramesTiresCheclist().allResults}
      onPressSubmit={handleSubmit}
      isLoading={isLoading}
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

      // DISPLAYING MEDIA
      mediaModalDetails={mediaModalDetails}
      mediaModalVisible={mediaModalVisible}
      handleMediaModalDetailsCrossPress={handleMediaModalDetailsCrossPress}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      onRemoveFrameImage={handleRemoveFrameImage}
      initialCommentText={checklistData?.[currentItemIndex]?.comment}
    />
  );
};

export default DVIRInspectionChecklistContainer;
