import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {IMAGES} from '../../Assets/Images';
import {
  ExteriorItemsExpandedCard,
  ExteriorItemsExpandedCard_Old,
  InteriorItemsAnnotationExpandedCard,
  InteriorItemsExpandedCard,
} from '../../Components';
import {ROUTES} from '../../Navigation/ROUTES';
import {DVIRInspectionChecklistScreen} from '../../Screens';
import {
  getChecklists,
  removeChecklistImageVideo as removeChecklistImageVideoAPI,
  updateChecklist,
} from '../../services/inspection';

const exteriorItemsExpandedCards = {
  existing: ExteriorItemsExpandedCard_Old,
  new: ExteriorItemsExpandedCard,
};
const interiorItemsExpandedCards = {
  existing: InteriorItemsExpandedCard,
  new: InteriorItemsAnnotationExpandedCard,
};

const DVIRInspectionChecklistContainer = ({navigation, route}) => {
  // State for checklist items
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [additionalComments, setAdditionalComments] = useState('');
  let {
    carVerificiationItems,
    exteriorItems,
    interiorItems,
    tires,
    plateNumber,
    /* skipLeft,
    skipLeftCorners,
    skipRight,
    skipRightCorners,*/
    isLicensePlateUploaded,
    vehicle_Type,
    variant,
    fileDetails,
    mileage = '',
    feedback,
    imageDimensions,
    selectedInspectionID,
  } = useSelector(state => state.newInspection) || {};
  const [checklistData, setChecklistData] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [captureFrames, setCaptureFrames] = useState([
    {
      id: 10,
      title: 'Exterior Front',
      frames: [
        {id: 'frontRight', image: IMAGES.truckRight},
        {id: 'frontLeft', image: IMAGES.truckLeft},
        {id: 'front', image: IMAGES.truckFront},
      ],
    },
    {
      id: 11,
      title: 'Exterior Rear',
      frames: [
        {id: 'rearRight', image: IMAGES.truckRight},
        {id: 'rearLeft', image: IMAGES.truckLeft},
        {id: 'rear', image: IMAGES.truckFront},
      ],
    },
    {
      id: 12,
      title: 'Full Front Interior (dash, steering wheel, Seat)',
      frames: [{id: 2, image: IMAGES.truckInterior}],
    },
    {
      id: 13,
      title: 'Rear Interior (back seats, floor) / Truck Bed',
      frames: [{id: 2, image: IMAGES.truckInterior}],
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
      id: 'brake',
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
      updateChecklist(
        selectedInspectionID,
        checklistData?.[cardIndex]?.checkId,
        data,
      );
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
    setModalVisible(true);
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

      setModalVisible(false);
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
      };

      navigation.navigate(isVideo ? ROUTES.VIDEO : ROUTES.CAMERA, {
        type: 1,
        modalDetails: details,
        inspectionId: selectedInspectionID,
        returnTo: ROUTES.DVIR_INSPECTION_CHECKLIST,
        returnToParams: {capturedImageIndex: index},
      });
    },
    [navigation, checklistData],
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
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
  const handleTireImage = useCallback((tireId, imageUri) => {
    setTireInspectionData(prevData =>
      prevData.map(tire =>
        tire.id === tireId ? {...tire, image: imageUri} : tire,
      ),
    );
  }, []);

  const ActiveExteriorItemsExpandedCard =
    exteriorItemsExpandedCards[vehicle_Type];
  const ActiveInteriorItemsExpandedCard =
    interiorItemsExpandedCards[vehicle_Type];

  const handleCaptureFrame = (itemId, frameId) => {
    // console.log('itemId', itemId);
    // console.log('frameId', frameId);

    const details = {
      title: 'Title',
      type: '1',
      uri: '',
      source: '',
      fileId: '',
    };

    navigation.navigate(ROUTES.CAMERA, {
      type: 1,
      modalDetails: details,
      inspectionId: 1,
      returnTo: ROUTES.DVIR_INSPECTION_CHECKLIST,
    });
  };

  const getChecklistsData = useCallback(async () => {
    setChecklistLoading(true);
    const response = await getChecklists(selectedInspectionID);
    setChecklistLoading(false);

    if (response.status == 200 && response?.data?.length > 0)
      setChecklistData(response.data);
  }, []);

  // Camera result handler
  useEffect(() => {
    if (
      route?.params?.capturedImageIndex !== undefined &&
      route?.params?.capturedImageUri
    ) {
      const {capturedImageIndex, capturedImageUri, capturedImageMime} =
        route.params;

      setChecklistData(prevData =>
        prevData.map((item, idx) =>
          idx === capturedImageIndex
            ? {
                ...item,
                url: [...(item.url || []), capturedImageUri],
              }
            : item,
        ),
      );

      updateChecklistAPIWithCardIndex(capturedImageIndex, {
        url: capturedImageUri,
        extension: capturedImageMime,
      });

      navigation.setParams({
        capturedImageIndex: undefined,
        capturedImageUri: undefined,
        capturedImageMime: undefined,
      });
    }
  }, [route?.params?.capturedImageIndex, route?.params?.capturedImageUri]);

  useEffect(() => {
    getChecklistsData();
  }, []);

  return (
    <DVIRInspectionChecklistScreen
      navigation={navigation}
      route={route}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
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
      handleCloseModal={handleCloseModal}
      onCheckItemRemoveImage={handleCheckItemRemoveImage}
      handleTireImage={handleTireImage}
      showChecklistSection={showChecklistSection}
      showTiresSection={showTiresSection}
      toggleChecklistSection={toggleChecklistSection}
      toggleTiresSection={toggleTiresSection}
      onPressCaptureFrame={handleCaptureFrame}
      commentModalImage={checklistData[currentItemIndex]?.url?.[0]}
    />
  );
};

export default DVIRInspectionChecklistContainer;
