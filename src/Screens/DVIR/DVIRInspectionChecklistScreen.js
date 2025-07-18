import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppText from '../../Components/text';
import {ROUTES} from '../../Navigation/ROUTES';
import {CircledChevron, CameraBlack, PlusBlack, DownloadBlue} from '../../Assets/Icons';
import { colors, NewInspectionStyles } from '../../Assets/Styles';
import { FooterButtons } from '../../Components';

const DVIRInspectionChecklistScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [overallCondition, setOverallCondition] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('Maintenance Required');
  const [additionalComments, setAdditionalComments] = useState('');
  const [inspectionData, setInspectionData] = useState([
    {
      id: 1,
      title:
        'Head Lights / Turn Signals / Hazard Warning Lights / Exterior Lamps / Wiper Blades',
      status: 'Good',
      comment: '',
    },
    {
      id: 2,
      title: 'Engine Bay (Wide Shot)',
      status: 'Good',
      comment: '',
    },
    {
      id: 3,
      title: 'Oil Dipstick (Photo Showing Oil Level/ Clarity)',
      status: 'Repair',
      comment: '',
    },
    {
      id: 4,
      title: 'Under-Body Leak Check (Photo Beneath Engine)',
      status: 'Replace',
      comment: '',
    },
    {
      id: 5,
      title:
        'Full Front Interior (Dash, Steering Wheel, Seats, Seat Belts, Airbags)',
      status: 'Good',
      comment: '',
    },
    {
      id: 6,
      title: 'Rear Interior (Back Seats, Floor) / Truck Bed',
      status: 'Repair',
      comment: '',
    },
    {
      id: 7,
      title: 'Radio / Navigation Screen (Powered On)',
      status: 'Repair',
      comment: '',
    },
    {
      id: 8,
      title: 'Jack & Tools (Jack, Wrench, Tool Kit)',
      status: 'Repair',
      comment: '',
    },
    {
      id: 9,
      title:
        'Tail Lights / Turn Signals / Brake Lights / Hazard Warning Lights / Exterior Lamps',
      status: 'Repair',
      comment: '',
    },
    {
      id: 10,
      title: 'Exterior Front',
      status: 'Good',
      comment: '',
      hasImages: true,
    },
    {
      id: 11,
      title: 'Exterior Rear',
      status: 'Good',
      comment: '',
      hasImages: true,
    },
  ]);

  const [tireInspectionData] = useState([
    { id: 'tdrf', title: 'Tread Depth RF (TDRF)', image: null },
    { id: 'tdrr', title: 'Tread Depth RR (TDRR)', image: null },
    { id: 'tdlf', title: 'Tread Depth LF (TDLF)', image: null },
    { id: 'tdlr', title: 'Tread Depth LR (TDLR)', image: null },
    { id: 'tdspare', title: 'Tread Depth Spare (TDSPARE)', image: null },
    { id: 'brake', title: 'Brake Components (photo of drums/rotors/lines)', image: null },
  ]);

  const conditionOptions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Needs Immediate Attention'
  ];

  const vehicleStatusOptions = [
    'Safe to Operate',
    'Maintenance Required',
    'Out of Service'
  ];

  const {container, bodyContainer} = NewInspectionStyles;

  // Memoize button styles to avoid recalculation
  const buttonStyles = useMemo(() => ({
    Good: {
      backgroundColor: '#4CAF50',
      textColor: '#FFFFFF',
    },
    Repair: {
      backgroundColor: '#FFC107',
      textColor: '#FFFFFF',
    },
    Replace: {
      backgroundColor: '#F44336',
      textColor: '#FFFFFF',
    },
    default: {
      backgroundColor: '#F5F5F5',
      textColor: '#666666',
    },
  }), []);

  const handleStatusChange = useCallback((index, status) => {
    setInspectionData(prevData => {
      const newData = [...prevData];
      newData[index].status = status;
      return newData;
    });
  }, []);

  const handleAddComment = useCallback((index) => {
    setCurrentItemIndex(index);
    setModalVisible(true);
  }, []);

  const handleSaveComment = useCallback((comments) => {
    if (currentItemIndex !== null) {
      setInspectionData(prevData => {
        const newData = [...prevData];
        newData[currentItemIndex].comment = comments;
        return newData;
      });
    }
    setModalVisible(false);
    setCurrentItemIndex(null);
  }, [currentItemIndex]);

  const handleOpenCamera = useCallback(() => {
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
    });
  }, [navigation]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDownloadPDF = useCallback(() => {
    // Implement PDF download logic
    console.log('Download PDF');
  }, []);

  const StatusButton = React.memo(({title, isSelected, onPress, type}) => {
    const buttonStyle = isSelected ? buttonStyles[type] : buttonStyles.default;

    return (
      <TouchableOpacity
        style={[styles.statusButton, {backgroundColor: buttonStyle.backgroundColor}]}
        onPress={onPress}
        activeOpacity={0.7}>
        <AppText style={[styles.statusText, {color: buttonStyle.textColor}]}>
          {title}
        </AppText>
      </TouchableOpacity>
    );
  });

  const UploadImageBox = React.memo(({title, onPress}) => (
    <TouchableOpacity 
      style={styles.uploadImageBox}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.uploadIcon}>
        <CameraBlack width={wp('8%')} height={wp('8%')} color="#4285F4" />
      </View>
      <AppText style={styles.uploadImageText}>Upload Image</AppText>
      <AppText style={styles.uploadImageTitle}>{title}</AppText>
    </TouchableOpacity>
  ));

  const TireInspectionSection = React.memo(() => (
    <View style={styles.sectionContainer}>
      <AppText style={styles.sectionTitle}>12. Tires</AppText>
      <View style={styles.tireGrid}>
        {tireInspectionData.map((tire, index) => (
          <UploadImageBox
            key={tire.id}
            title={tire.title}
            onPress={() => handleOpenCamera()}
          />
        ))}
      </View>
    </View>
  ));

  const DropdownSelector = React.memo(({title, value, options, onSelect, placeholder}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = useCallback((option) => {
      onSelect(option);
      setIsOpen(false);
    }, [onSelect]);

    return (
      <View style={styles.dropdownContainer}>
        <AppText style={styles.dropdownLabel}>{title}</AppText>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.7}>
          <AppText style={[
            styles.dropdownButtonText,
            !value && styles.dropdownPlaceholder
          ]}>
            {value || placeholder}
          </AppText>
          <AppText style={styles.dropdownArrow}>▼</AppText>
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownOptions}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}>
                <AppText style={styles.dropdownOptionText}>{option}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  });

  const InspectionItem = React.memo(({item, index}) => {
    const handleStatusGood = useCallback(() => handleStatusChange(index, 'Good'), [index]);
    const handleStatusRepair = useCallback(() => handleStatusChange(index, 'Repair'), [index]);
    const handleStatusReplace = useCallback(() => handleStatusChange(index, 'Replace'), [index]);
    const handleComment = useCallback(() => handleAddComment(index), [index]);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <AppText style={styles.itemNumber}>{index + 1}.</AppText>
          <AppText style={styles.itemTitle}>{item.title}</AppText>
          {(item.id !== 10 && item.id !== 11) && (
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={handleComment}
                activeOpacity={0.7}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <PlusBlack width={wp('7%')} height={wp('7%')} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleOpenCamera}
                activeOpacity={0.7}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <CameraBlack width={wp('7%')} height={wp('7%')} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {(item.id !== 10 && item.id !== 11) && (
          <View style={styles.statusContainer}>
            <StatusButton
              title="Good"
              type="Good"
              isSelected={item.status === 'Good'}
              onPress={handleStatusGood}
            />
            <StatusButton
              title="Repair"
              type="Repair"
              isSelected={item.status === 'Repair'}
              onPress={handleStatusRepair}
            />
            <StatusButton
              title="Replace"
              type="Replace"
              isSelected={item.status === 'Replace'}
              onPress={handleStatusReplace}
            />
          </View>
        )}

        {item.hasImages && (
          <View style={styles.imageContainer}>
            <View style={styles.imageBox}>
              <Image
                source={{uri: 'https://www.shutterstock.com/shutterstock/photos/384697171/display_1500/stock-vector-car-logo-vector-illustration-384697171.jpg'}}
                style={styles.placeholderImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.imageBox}>
              <Image
                source={{uri: 'https://www.shutterstock.com/shutterstock/photos/384697171/display_1500/stock-vector-car-logo-vector-illustration-384697171.jpg'}}
                style={styles.placeholderImage}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity 
              style={styles.captureImageBox}
              activeOpacity={0.7}>
              <CameraBlack width={wp('6%')} height={wp('6%')} color="#4285F4" />
              <AppText style={styles.captureImageText}>Capture image</AppText>
            </TouchableOpacity>
          </View>
        )}

        {item.comment ? (
          <View style={styles.commentContainer}>
            <AppText style={styles.commentText}>{item.comment}</AppText>
          </View>
        ) : null}
      </View>
    );
  });

  const CommentModal = React.memo(() => {
    const [text, setText] = useState('');

    const handleSave = useCallback(() => {
      handleSaveComment(text);
      setText('');
    }, [text]);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={{uri: 'https://via.placeholder.com/300x200'}}
              style={styles.modalImage}
              resizeMode="cover"
            />
            <AppText style={styles.modalTitle}>Comments</AppText>
            <TextInput
              style={styles.commentInput}
              placeholder="Add your comments here"
              value={text}
              onChangeText={setText}
              multiline={true}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <TouchableOpacity
              style={styles.okButton}
              onPress={handleSave}
              activeOpacity={0.8}>
              <AppText style={styles.okButtonText}>OK</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  });

  return (
    <View style={container}>
      <View style={bodyContainer}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Interior / Exterior Items</AppText>
          <View style={styles.headerRight}>
            <TouchableOpacity activeOpacity={0.7}>
              <CircledChevron width={wp('6%')} height={wp('6%')}/>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={3}
          windowSize={8}
          initialNumToRender={3}
          updateCellsBatchingPeriod={50}
          contentContainerStyle={{flexGrow: 1}}
          >
          
          {/* Original Inspection Items */}
          {inspectionData.map((item, index) => (
            <InspectionItem key={item.id} item={item} index={index} />
          ))}

          {/* Tire Inspection Section */}
          <TireInspectionSection />

          {/* Overall Condition Section */}
          <View style={styles.sectionContainer}>
            <DropdownSelector
              title="Overall Condition"
              value={overallCondition}
              options={conditionOptions}
              onSelect={setOverallCondition}
              placeholder="Select Condition"
            />
          </View>

          {/* Vehicle Status Section */}
          <View style={styles.sectionContainer}>
            <DropdownSelector
              title="Vehicle Status"
              value={vehicleStatus}
              options={vehicleStatusOptions}
              onSelect={setVehicleStatus}
              placeholder="Select Status"
            />
          </View>

          {/* Additional Comments Section */}
          <View style={styles.sectionContainer}>
            <AppText style={styles.sectionTitle}>Additional Comments</AppText>
            <TextInput
              style={styles.additionalCommentsInput}
              placeholder="Add your comments here"
              value={additionalComments}
              onChangeText={setAdditionalComments}
              multiline={true}
              textAlignVertical="top"
            />
          </View>

          {/* Download PDF Button */}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadPDF}
            activeOpacity={0.7}>
            <DownloadBlue width={wp('5%')} height={wp('5%')}/>
            <AppText style={styles.downloadButtonText}>Download Vehicle Inspection PDF</AppText>
          </TouchableOpacity>

          {/* Bottom spacing for footer */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>

      <FooterButtons 
        containerStyle={styles.footerButtonContainer} 
        cancelText='Back' 
        confirmText='Next' 
      />
      
      <CommentModal />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: colors.royalBlue,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    marginVertical: hp(1),
    borderRadius: wp(2),
    borderBottomWidth: 0.2,
    borderBottomColor: '#E0E0E0',
    padding: wp(4),
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  itemNumber: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#333333',
    marginRight: wp(2),
  },
  itemTitle: {
    fontSize: wp(3.8),
    color: '#333333',
    flex: 1,
    lineHeight: wp(5),
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: wp(2),
    gap: wp('2%')
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp(1),
  },
  statusButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(0.8),
    borderRadius: wp(6),
    marginRight: wp(3),
    minWidth: wp(20),
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  statusText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  imageBox: {
    width: wp(25),
    height: hp(12),
    borderRadius: wp(2),
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
  },
  captureImageBox: {
    width: wp(25),
    height: hp(12),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  captureImageText: {
    fontSize: wp(2.8),
    color: '#4285F4',
    marginTop: hp(0.5),
    textAlign: 'center',
  },
  commentContainer: {
    marginTop: hp(1),
    padding: wp(3),
    backgroundColor: '#F8F9FA',
    borderRadius: wp(2),
  },
  commentText: {
    fontSize: wp(3.5),
    color: '#666666',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    padding: wp(4),
    borderBottomWidth: 0.2,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#333333',
    marginBottom: hp(2),
  },
  tireGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: hp(1.5),
  },
  uploadImageBox: {
    width: wp(38),
    height: hp(15),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: wp(2),
  },
  uploadIcon: {
    marginBottom: hp(0.5),
  },
  uploadImageText: {
    fontSize: wp(3.2),
    color: '#4285F4',
    fontWeight: '500',
    textAlign: 'center',
  },
  uploadImageTitle: {
    fontSize: wp(2.8),
    color: '#666666',
    textAlign: 'center',
    marginTop: hp(0.5),
    lineHeight: wp(3.5),
  },
  dropdownContainer: {},
  dropdownLabel: {
    fontSize: wp(4.2),
    fontWeight: '600',
    color: '#333333',
    marginBottom: hp(1),
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp(2),
    padding: wp(3.5),
    backgroundColor: '#F8F9FA',
  },
  dropdownButtonText: {
    fontSize: wp(4),
    color: '#333333',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: wp(3),
    color: '#666666',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderBottomLeftRadius: wp(2),
    borderBottomRightRadius: wp(2),
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownOption: {
    padding: wp(3.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionText: {
    fontSize: wp(4),
    color: '#333333',
  },
  additionalCommentsInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp(2),
    padding: wp(3),
    height: hp(12),
    fontSize: wp(4),
    color: '#333333',
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
  },
  downloadButton: {
    borderRadius: wp(2),
    paddingVertical: wp(4),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    gap: wp(2),
    alignSelf: 'flex-start'
  },
  downloadButtonText: {
    color: colors.royalBlue,
    fontSize: wp(4),
    fontWeight: '500',
  },
  bottomSpacing: {
    height: hp(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4),
    padding: wp(5),
    width: wp(85),
    maxHeight: hp(70),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalImage: {
    width: '100%',
    height: hp(25),
    borderRadius: wp(2),
    marginBottom: hp(2),
    backgroundColor: '#F5F5F5',
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    color: '#333333',
    marginBottom: hp(2),
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp(2),
    padding: wp(3),
    height: hp(15),
    fontSize: wp(4),
    color: '#333333',
    marginBottom: hp(3),
    backgroundColor: '#F8F9FA',
  },
  okButton: {
    backgroundColor: '#FF9800',
    borderRadius: wp(6),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: '600',
  },
  footerButtonContainer: {
    backgroundColor: colors.white, 
    width: '100%', 
    justifyContent: "space-around", 
    flexDirection: 'row-reverse'
  }
});

export default DVIRInspectionChecklistScreen;