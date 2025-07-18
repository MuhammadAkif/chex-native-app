import React, {useState} from 'react';
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
import {navigate} from '../../services/navigationService';
import {ROUTES} from '../../Navigation/ROUTES';
import {CommentIcon, Camera} from '../../Assets/Icons';

const VehicleInspectionScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
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
    {
      id: 12,
      title: 'Additional Comments',
      status: 'Good',
      comment: '',
    },
  ]);

  const handleStatusChange = (index, status) => {
    const newData = [...inspectionData];
    newData[index].status = status;
    setInspectionData(newData);
  };

  const handleAddComment = index => {
    setCurrentItemIndex(index);
    setModalVisible(true);
  };

  const handleSaveComment = comments => {
    if (currentItemIndex !== null) {
      const newData = [...inspectionData];
      newData[currentItemIndex].comment = comments;
      setInspectionData(newData);
    }
    setModalVisible(false);
    setCurrentItemIndex(null);
  };

  const StatusButton = ({title, isSelected, onPress, type}) => {
    let backgroundColor = '#F5F5F5';
    let textColor = '#666666';

    if (isSelected) {
      switch (type) {
        case 'Good':
          backgroundColor = '#4CAF50';
          textColor = '#FFFFFF';
          break;
        case 'Repair':
          backgroundColor = '#FFC107';
          textColor = '#FFFFFF';
          break;
        case 'Replace':
          backgroundColor = '#F44336';
          textColor = '#FFFFFF';
          break;
      }
    }

    return (
      <TouchableOpacity
        style={[styles.statusButton, {backgroundColor}]}
        onPress={onPress}>
        <AppText style={[styles.statusText, {color: textColor}]}>
          {title}
        </AppText>
      </TouchableOpacity>
    );
  };

  const InspectionItem = ({item, index}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <AppText style={styles.itemNumber}>{index + 1}.</AppText>
          <AppText style={styles.itemTitle}>{item.title}</AppText>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleAddComment(index)}>
              <Icon name="add" size={wp(4)} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate(ROUTES.CAMERA, {})}>
              <Camera width={wp('5%')} height={wp('5%')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="video" size={wp(4)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <StatusButton
            title="Good"
            type="Good"
            isSelected={item.status === 'Good'}
            onPress={() => handleStatusChange(index, 'Good')}
          />
          <StatusButton
            title="Repair"
            type="Repair"
            isSelected={item.status === 'Repair'}
            onPress={() => handleStatusChange(index, 'Repair')}
          />
          <StatusButton
            title="Replace"
            type="Replace"
            isSelected={item.status === 'Replace'}
            onPress={() => handleStatusChange(index, 'Replace')}
          />
        </View>

        {item.hasImages && (
          <View style={styles.imageContainer}>
            <View style={styles.imageBox}>
              <Image
                source={{uri: 'https://via.placeholder.com/150x100'}}
                style={styles.placeholderImage}
              />
            </View>
            <View style={styles.imageBox}>
              <Image
                source={{uri: 'https://via.placeholder.com/150x100'}}
                style={styles.placeholderImage}
              />
            </View>
            <TouchableOpacity style={styles.captureImageBox}>
              <Icon name="camera" size={wp(8)} color="#4285F4" />
              <AppText style={styles.captureImageText}>Capture image</AppText>
            </TouchableOpacity>
          </View>
        )}

        {item.comment && (
          <View style={styles.commentContainer}>
            <AppText style={styles.commentText}>{item.comment}</AppText>
          </View>
        )}
      </View>
    );
  };

  const CommentModal = () => {
    const [text, setText] = useState('');

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={{uri: 'https://via.placeholder.com/300x200'}}
              style={styles.modalImage}
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
            />
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => handleSaveComment(text)}>
              <AppText style={styles.okButtonText}>OK</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Placeholder Icon component - replace with your SVG icons
  const Icon = ({name, size, color}) => (
    <View style={[styles.iconPlaceholder, {width: size, height: size}]}>
      <AppText style={[styles.iconText, {color, fontSize: size * 0.6}]}>
        {name.charAt(0).toUpperCase()}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Interior / Exterior Items</AppText>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="menu" size={wp(6)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {inspectionData.map((item, index) => (
          <InspectionItem key={item.id} item={item} index={index} />
        ))}
      </ScrollView>

      <CommentModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: wp(2),
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#4285F4',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    backgroundColor: '#666666',
    borderRadius: wp(6),
    padding: wp(2),
    marginLeft: wp(2),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    marginVertical: hp(1),
    borderRadius: wp(2),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  },
  iconButton: {
    backgroundColor: '#4285F4',
    borderRadius: wp(1.5),
    padding: wp(2),
    marginLeft: wp(1),
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp(1),
  },
  statusButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: wp(6),
    marginRight: wp(3),
    minWidth: wp(20),
    alignItems: 'center',
  },
  statusText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: hp(2),
    justifyContent: 'space-between',
  },
  imageBox: {
    width: wp(25),
    height: hp(12),
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
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
    fontSize: wp(3),
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
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: '600',
  },
  iconPlaceholder: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: 'bold',
  },
});

export default VehicleInspectionScreen;
