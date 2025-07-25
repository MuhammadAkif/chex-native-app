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
    selectedInspectionID,
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
    newInspectionId,
  } = useSelector(state => state.newInspection) || {};
  const [inspectionData, setInspectionData] = useState([
    {
      id: 1,
      title:
        'Head Lights / Turn Signals / Hazard Warning Lights / Exterior Lamps / Wiper Blades',
      status: 'Good',
      comment: '',
      videos: [],
    },
    {
      id: 2,
      title: 'Engine Bay (Wide Shot)',
      status: 'Good',
      comment: '',
      images: [],
    },
    {
      id: 3,
      title: 'Oil Dipstick (Photo Showing Oil Level/ Clarity)',
      status: 'Repair',
      comment: '',
      images: [],
    },
    {
      id: 4,
      title: 'Under-Body Leak Check (Photo Beneath Engine)',
      status: 'Replace',
      comment: '',
      images: [],
    },
    {
      id: 7,
      title: 'Radio / Navigation Screen (Powered On)',
      status: 'Repair',
      comment: '',
      images: [],
    },
    {
      id: 8,
      title: 'Jack & Tools (Jack, Wrench, Tool Kit)',
      status: 'Repair',
      comment: '',
      images: [],
    },
    {
      id: 9,
      title:
        'Tail Lights / Turn Signals / Brake Lights / Hazard Warning Lights / Exterior Lamps',
      status: 'Repair',
      comment: '',
      videos: [],
    },
  ]);

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

  const handleStatusChange = useCallback((index, status) => {
    setInspectionData(prevData => {
      const newData = [...prevData];
      newData[index].status = status;
      return newData;
    });
  }, []);

  const handleAddComment = useCallback(index => {
    setCurrentItemIndex(index);
    setModalVisible(true);
  }, []);

  const handleSaveComment = useCallback(
    comments => {
      if (currentItemIndex !== null) {
        setInspectionData(prevData => {
          const newData = [...prevData];
          newData[currentItemIndex].comment = comments;
          return newData;
        });
      }
      setModalVisible(false);
      setCurrentItemIndex(null);
    },
    [currentItemIndex],
  );

  const handleOpenCamera = useCallback(
    (index, videos) => {
      const isVideo = !!videos;
      const details = {
        title: inspectionData[index]?.title || 'Title',
        type: '1',
        uri: '',
        source: '',
        fileId: '',
      };

      navigation.navigate(isVideo ? ROUTES.VIDEO : ROUTES.CAMERA, {
        type: 1,
        modalDetails: details,
        inspectionId: newInspectionId,
        capturedImageIndex: index,
        returnTo: ROUTES.DVIR_INSPECTION_CHECKLIST,
      });
    },
    [navigation, inspectionData],
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleRemoveImage = useCallback((itemIndex, imageIndex) => {
    setInspectionData(prevData =>
      prevData.map((item, idx) =>
        idx === itemIndex
          ? {...item, images: item.images.filter((_, i) => i !== imageIndex)}
          : item,
      ),
    );
  }, []);

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
  console.log(
    'ActiveExteriorItemsExpandedCard:',
    ActiveExteriorItemsExpandedCard,
  );
  const handleCaptureFrame = (itemId, frameId) => {
    // console.log('itemId', itemId);
    // console.log('frameId', frameId);

    const details = {
      title: inspectionData[index]?.title || 'Title',
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

  // Camera result handler
  useEffect(() => {
    if (
      route?.params?.capturedImageIndex !== undefined &&
      route?.params?.capturedImageUri
    ) {
      const {capturedImageIndex, capturedImageUri} = route.params;
      setInspectionData(prevData =>
        prevData.map((item, idx) =>
          idx === capturedImageIndex
            ? {
                ...item,
                [item.videos ? 'videos' : 'images']: [
                  ...(item[item.videos ? 'videos' : 'images'] || []),
                  capturedImageUri,
                ],
              }
            : item,
        ),
      );
      navigation.setParams({
        capturedImageIndex: undefined,
        capturedImageUri: undefined,
      });
    }
  }, [route?.params?.capturedImageIndex, route?.params?.capturedImageUri]);

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
      inspectionData={inspectionData}
      setInspectionData={setInspectionData}
      captureFrames={captureFrames}
      setCaptureFrames={setCaptureFrames}
      tireInspectionData={tireInspectionData}
      setTireInspectionData={setTireInspectionData}
      buttonStyles={buttonStyles}
      handleStatusChange={handleStatusChange}
      handleAddComment={handleAddComment}
      handleSaveComment={handleSaveComment}
      handleOpenCamera={handleOpenCamera}
      handleCloseModal={handleCloseModal}
      handleRemoveImage={handleRemoveImage}
      handleTireImage={handleTireImage}
      showChecklistSection={showChecklistSection}
      showTiresSection={showTiresSection}
      toggleChecklistSection={toggleChecklistSection}
      toggleTiresSection={toggleTiresSection}
      onPressCaptureFrame={handleCaptureFrame}
    />
  );
};

export default DVIRInspectionChecklistContainer;
