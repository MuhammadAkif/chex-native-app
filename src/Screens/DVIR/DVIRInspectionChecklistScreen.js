import React from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {CameraBorderedIcon, CircledChevron, CrossCircledIcon, MovieIcon, VideoBorderedIcon} from '../../Assets/Icons';
import CommentBorderedIcon from '../../Assets/Icons/CommentBorderedIcon';
import CrossBlue from '../../Assets/Icons/CrossBlue';
import {IMAGES} from '../../Assets/Images';
import {colors, NewInspectionStyles} from '../../Assets/Styles';
import {
  AndroidMediaViewModal,
  CaptureImageModal,
  DisplayMediaModal,
  FooterButtons,
  LoadingIndicator,
  LogoHeader,
  PrimaryGradientButton,
  VideoPicker,
} from '../../Components';
import AppText from '../../Components/text';

const {container, bodyContainer, headerContainer, headerTitleText} = NewInspectionStyles;

const {OS} = Platform;
const mediaViewModals = {
  ios: DisplayMediaModal,
  android: AndroidMediaViewModal,
};
const ActiveMediaViewModal = mediaViewModals[OS];

// Move StatusButton outside so it is available to InspectionItem
const StatusButton = React.memo(({title, isSelected, onPress, type, buttonStyles}) => {
  const buttonStyle = isSelected ? buttonStyles?.[type] : buttonStyles?.default;

  return (
    <TouchableOpacity
      style={[styles.statusButton, {backgroundColor: buttonStyle?.backgroundColor}]}
      onPress={() => onPress(type)}
      activeOpacity={0.7}>
      <AppText style={[styles.statusText, {color: buttonStyle?.textColor}]}>{title}</AppText>
    </TouchableOpacity>
  );
});

// Move ChecklistItem outside the main component
const ChecklistItem = React.memo(
  ({
    item,
    index,
    onChecklistStatusChange,
    onComment,
    onCamera,
    onRemove,
    CrossCircledIcon,
    CameraBorderedIcon,
    VideoBorderedIcon,
    buttonStyles,
    onMediaPress,
  }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <AppText style={styles.itemTitle}>{item?.name}</AppText>

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => onComment(index)} activeOpacity={0.7}>
              <CommentBorderedIcon color={item?.comment ? colors.royalBlue : '#414B55'} width={wp('7%')} height={wp('7%')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCamera(index, item?.fileType == 'video')} activeOpacity={0.7}>
              {item?.fileType == 'video' ? (
                <VideoBorderedIcon width={wp('7%')} height={wp('7%')} color={item?.url?.length > 0 ? colors.orangePeel : colors.royalBlue} />
              ) : (
                <CameraBorderedIcon width={wp('7%')} height={wp('7%')} color={item?.url?.length > 0 ? colors.orangePeel : colors.royalBlue} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusContainer}>
          {item?.options?.map((option, idx) => (
            <StatusButton
              key={idx}
              title={option}
              type={option}
              isSelected={item.checkStatus === option}
              onPress={() => onChecklistStatusChange(option, index, idx)}
              buttonStyles={buttonStyles}
            />
          ))}
        </View>

        {/* Show captured images for items*/}
        {item?.url && item.url.length > 0 && (
          <View style={styles.itemImagesContainer}>
            {item.url.map((img, imgIdx) => (
              <View key={imgIdx} style={styles.itemImageWrapper}>
                {item?.fileType === 'video' ? (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onMediaPress(item, 'checklist', imgIdx)} style={styles.itemImageContainer}>
                    <MovieIcon width={wp(7)} height={wp(7)} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onMediaPress(item, 'checklist', imgIdx)} style={styles.itemImageContainer}>
                    <Image source={{uri: img}} style={styles.itemImage} resizeMode="cover" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => onRemove(index, imgIdx)} style={styles.removeImageButton}>
                  <CrossCircledIcon />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {item.comment ? (
          <View style={styles.commentContainer}>
            <AppText style={styles.commentText}>{item.comment}</AppText>
          </View>
        ) : null}
      </View>
    );
  }
);

// Move CommentModal outside the main component
const CommentModal = React.memo(({visible, onClose, onSave, initialValue = '', modalImage}) => {
  const [text, setText] = React.useState(initialValue);

  React.useEffect(() => {
    setText(initialValue);
  }, [initialValue, visible]);

  const handleSave = React.useCallback(() => {
    onSave(text);
    setText('');
  }, [text, onSave]);

  const handleClose = React.useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose} statusBarTranslucent={true}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingContainer}>
        <ScrollView contentContainerStyle={styles.modalOverlay} keyboardShouldPersistTaps="handled" bounces={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              {modalImage && <Image source={{uri: modalImage}} style={styles.modalImage} resizeMode="cover" />}
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
                placeholderTextColor={colors.steelGray}
              />
              <FooterButtons
                containerStyle={{width: '100%', gap: 15, paddingHorizontal: 0}}
                disabledConfirm={initialValue === text}
                onSubmit={handleSave}
                onCancel={handleClose}
                isLoading={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
});

// Remove all state, useEffect, and business logic. Accept all state, handlers, and data as props from the container.
const DVIRInspectionChecklistScreen = ({
  navigation,
  route,
  addCommentModalVisible,
  currentItemIndex,
  setCurrentItemIndex,
  additionalComments,
  setAdditionalComments,
  checklistData,
  setChecklistData,
  captureFrames,
  setCaptureFrames,
  tireInspectionData,
  setTireInspectionData,
  buttonStyles,
  onCommentIconPress,
  onSaveComment,
  onCheckItemCameraIconPress,
  handleCloseModal,
  onCheckItemRemoveImage,
  onPressTireImage,
  showChecklistSection,
  showTiresSection,
  toggleChecklistSection,
  toggleTiresSection,
  onPressCaptureFrame,
  onChecklistStatusChange,
  checklistLoading,
  commentModalImage,
  captureImageModalVisible,
  setCaptureImageModalVisible,
  hasSubmitButtonShow,
  onPressSubmit,
  isLoading,
  // CAPTURE MODAL DETAILS
  source,
  instructionalText,
  buttonText,
  title,
  isVideo,
  modalKey,
  isCarVerification,
  isExterior,
  isInterior,
  instructionalSubHeadingText,
  instructionalSubHeadingText_1,
  instructionalSubHeadingText_2,
  handleFramesCaptureImage,
  // CAPTURE MODAL DETAILS

  // DISPLAY MEDIA MODAL
  mediaModalVisible,
  mediaModalDetails,
  handleMediaModalDetailsCrossPress,
  handleMediaModalDetailsPress,
  onRemoveFrameImage,
  initialCommentText,
}) => {
  // Prepare sections for SectionList
  const sections = [
    {
      key: 'checklist',
      title: 'Check List Items',
      data: [null], // single item, will render the checklist section
    },
    {
      key: 'tires',
      title: 'Tires',
      data: [null], // single item, will render the tires section
    },
  ];

  const renderSectionHeader = ({section}) => null; // No UI change

  const renderItem = ({section}) => {
    if (section.key === 'checklist') {
      return (
        <View style={styles.secondBodyContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <AppText style={styles.headerLeftText}>1</AppText>
            </View>
            <AppText style={styles.headerTitle}>Check List Items</AppText>
            <View style={styles.headerRight}>
              <TouchableOpacity activeOpacity={0.7} onPress={toggleChecklistSection} style={!showChecklistSection && styles.rotateChevron}>
                {checklistLoading ? (
                  <ActivityIndicator size="small" color={colors.royalBlue} />
                ) : (
                  <CircledChevron stroke={showChecklistSection ? colors.orangePeel : colors.gray} width={wp('6%')} height={wp('6%')} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {showChecklistSection && !checklistLoading && (
            <>
              <View style={styles.cardItems}>
                {checklistData.map((item, index) => (
                  <ChecklistItem
                    key={item.checkId}
                    item={item}
                    index={index}
                    onChecklistStatusChange={onChecklistStatusChange}
                    onComment={onCommentIconPress}
                    onCamera={onCheckItemCameraIconPress}
                    onRemove={onCheckItemRemoveImage}
                    CrossCircledIcon={CrossCircledIcon}
                    CameraBorderedIcon={CameraBorderedIcon}
                    VideoBorderedIcon={VideoBorderedIcon}
                    buttonStyles={buttonStyles}
                    onMediaPress={handleMediaModalDetailsPress}
                  />
                ))}
              </View>

              <View style={{marginTop: hp(4)}}>
                <View
                  style={[
                    styles.header,
                    {
                      paddingLeft: wp(4),
                      paddingBottom: hp(1.5),
                      paddingTop: 0,
                    },
                  ]}>
                  <AppText style={styles.headerTitle}>Capture Frames</AppText>
                </View>

                <View style={styles.cardItems}>
                  {captureFrames.map(item => (
                    <View style={[styles.itemContainer, {gap: wp(5)}]} key={item.id}>
                      <AppText style={styles.captureFrameTitle}>{item?.title}</AppText>

                      <View style={styles.captureFrameRow}>
                        {item?.frames?.map(frame => (
                          <TouchableOpacity
                            key={frame.id}
                            style={frame?.image ? [styles.captureImageBox, styles.captureImageBoxWithImage] : styles.captureImageBox}
                            activeOpacity={0.7}
                            onPress={() =>
                              frame?.image ? handleMediaModalDetailsPress(frame, 'capture_frame', 0) : onPressCaptureFrame(item?.id, frame?.id)
                            }>
                            <FastImage
                              source={frame?.image ? {uri: frame.image} : frame.icon}
                              style={frame?.image ? styles.captureImageStyleWithImage : styles.captureImageStyle}
                              resizeMode={frame?.image ? 'cover' : 'contain'}
                            />
                            {frame?.image ? (
                              <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => onRemoveFrameImage(item?.id, frame?.id, frame?.fileId, 'capture_frames')}
                                style={[styles.removeImageButton, styles.removeImageButtonWithImage]}>
                                <CrossBlue width={wp(5.5)} height={wp(5.5)} />
                              </TouchableOpacity>
                            ) : (
                              <>
                                <AppText style={styles.captureImageText}>Capture image</AppText>
                                <CameraBorderedIcon width={wp(6)} height={wp(6)} style={styles.captureImageBoxIcon} />
                              </>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      );
    }
    if (section.key === 'tires') {
      return (
        <View style={[styles.secondBodyContainer]}>
          <View style={[styles.header]}>
            <View style={styles.headerLeft}>
              <AppText style={styles.headerLeftText}>2</AppText>
            </View>
            <AppText style={styles.headerTitle}>Tires</AppText>
            <View style={styles.headerRight}>
              <TouchableOpacity activeOpacity={0.7} onPress={toggleTiresSection} style={!showTiresSection && styles.rotateChevron}>
                <CircledChevron width={wp('6%')} height={wp('6%')} stroke={showTiresSection ? colors.orangePeel : colors.gray} />
              </TouchableOpacity>
            </View>
          </View>

          {showTiresSection && (
            <View style={styles.tiresContainer}>
              {/* Main Truck with Overlaid Tire Positions */}
              <View style={styles.truckWithTiresContainer}>
                {/* Truck Diagram - Larger and Centered */}
                <View style={styles.truckDiagramContainer}>
                  <FastImage source={IMAGES.truckBody} style={styles.truckBodyImage} resizeMode="contain" />
                </View>

                {/* Tire Capture Boxes Positioned Over Truck Tires */}
                {/* Map tireInspectionData for tire positions */}
                {tireInspectionData.slice(0, 4).map((tire, idx) => {
                  // Map index to position style
                  let positionStyle = null;
                  if (tire.id === 'tdlf') {
                    positionStyle = styles.frontLeftPosition;
                  } else if (tire.id === 'tdrf') {
                    positionStyle = styles.frontRightPosition;
                  } else if (tire.id === 'tdlr') {
                    positionStyle = [styles.rearLeftPosition, {flexDirection: 'column-reverse'}];
                  } else if (tire.id === 'tdrr') {
                    positionStyle = [styles.rearRightPosition, {flexDirection: 'column-reverse'}];
                  }
                  return (
                    <View style={[styles.tirePositionContainer, positionStyle]} key={tire.id}>
                      <TouchableOpacity
                        style={[styles.tireCaptureBox, tire?.image && styles.tireCaptureImageBox]}
                        activeOpacity={0.7}
                        onPress={
                          tire?.image ? () => handleMediaModalDetailsPress?.(tire, 'tire', 0) : () => onPressTireImage?.(tire.id, tire?.title)
                        }>
                        <View style={[styles.tireIconContainer, tire?.image && styles.tireImageContainer]}>
                          <FastImage
                            source={tire?.image ? {uri: tire.image} : IMAGES[tire.icon]}
                            style={tire.image ? styles.tireImage : styles.tireIcon}
                            resizeMode={tire?.image ? 'cover' : 'contain'}
                          />
                        </View>
                        {tire?.image ? (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => onRemoveFrameImage(tire?.id, undefined, tire?.fileId, 'tires')}
                            style={[styles.removeImageButton, styles.removeImageButtonWithImage]}>
                            <CrossBlue width={wp(5.5)} height={wp(5.5)} />
                          </TouchableOpacity>
                        ) : (
                          <>
                            <CameraBorderedIcon width={wp(4)} height={wp(4)} style={styles.cameraIcon} />
                            <AppText style={styles.tireCaptureText}>Capture image</AppText>
                          </>
                        )}
                      </TouchableOpacity>
                      <AppText style={styles.tireLabel}>{tire.title}</AppText>
                    </View>
                  );
                })}
              </View>

              {/* Bottom Section - Spare Tire and Brake Components */}
              <View style={styles.bottomTiresRow}>
                {tireInspectionData.slice(4).map(tire => (
                  <View style={styles.bottomTireItem} key={tire.id}>
                    <TouchableOpacity
                      style={[styles.tireCaptureBox, tire?.image && styles.tireCaptureImageBox]}
                      activeOpacity={0.7}
                      onPress={tire?.image ? () => handleMediaModalDetailsPress?.(tire, 'tire', 0) : () => onPressTireImage?.(tire.id, tire?.title)}>
                      <View style={[styles.tireIconContainer, tire?.image && styles.tireImageContainer]}>
                        <FastImage
                          source={tire?.image ? {uri: tire.image} : IMAGES[tire.icon]}
                          style={tire.image ? styles.tireImage : styles.tireIcon}
                          resizeMode={tire?.image ? 'cover' : 'contain'}
                        />
                      </View>
                      {tire?.image ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => onRemoveFrameImage(tire?.id, undefined, tire?.fileId, 'tires')}
                          style={[styles.removeImageButton, styles.removeImageButtonWithImage]}>
                          <CrossBlue width={wp(5.5)} height={wp(5.5)} />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <CameraBorderedIcon width={wp(4)} height={wp(4)} style={styles.cameraIcon} />
                          <AppText style={styles.tireCaptureText}>Capture image</AppText>
                        </>
                      )}
                    </TouchableOpacity>
                    <AppText style={styles.tireLabel}>{tire.title}</AppText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={container}>
      <LogoHeader />
      <LoadingIndicator isLoading={isLoading} />
      <View style={headerContainer}>
        <AppText style={headerTitleText}>Please complete inspection items within each category below</AppText>
      </View>
      <View style={bodyContainer}>
        <SectionList
          sections={sections}
          keyExtractor={(_, index) => `${index}`}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        />
        {hasSubmitButtonShow && <PrimaryGradientButton onPress={onPressSubmit} text={'Submit'} buttonStyle={styles.buttonContainer} />}
      </View>

      <CommentModal
        visible={addCommentModalVisible}
        onClose={handleCloseModal}
        onSave={onSaveComment}
        modalImage={commentModalImage}
        initialValue={initialCommentText}
      />

      {captureImageModalVisible && (
        <CaptureImageModal
          modalVisible={captureImageModalVisible}
          handleVisible={setCaptureImageModalVisible}
          source={source}
          instructionalText={instructionalText}
          buttonText={buttonText}
          title={title}
          isVideo={isVideo}
          instructionalSubHeadingText={instructionalSubHeadingText || ''}
          instructionalSubHeadingText_1={instructionalSubHeadingText_1 || ''}
          instructionalSubHeadingText_2={instructionalSubHeadingText_2 || ''}
          modalKey={modalKey}
          handleCaptureImage={handleFramesCaptureImage}
          isCarVerification={isCarVerification}
          isExterior={isExterior || isInterior}
        />
      )}

      {mediaModalVisible && (
        <ActiveMediaViewModal
          title={mediaModalDetails?.title}
          isVideo={mediaModalDetails?.isVideo}
          source={mediaModalDetails?.source}
          coordinates={[]}
          handleVisible={handleMediaModalDetailsCrossPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    // marginBottom: hp(1.5),
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  secondBodyContainer: {
    // flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: colors.white,
    elevation: 2,
    margin: wp(3.5),
    borderRadius: wp(1.5),
    paddingBottom: wp(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: wp(4),
    paddingLeft: wp(7),
    paddingVertical: hp(2),
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: colors.royalBlue,
    flex: 1,
  },
  headerLeft: {
    position: 'absolute',
    left: wp(-2),
    backgroundColor: 'rgba(231, 239, 248, 1)',
    borderRadius: wp(1),
    width: wp(7),
    height: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerLeftText: {fontWeight: '500', fontSize: wp(4), color: colors.royalBlue},
  scrollView: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    // marginVertical: hp(1),
    borderRadius: wp(2),
    borderBottomWidth: 0.2,
    borderBottomColor: '#E0E0E0',
    padding: wp(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    marginHorizontal: wp(3),
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
    color: colors.black,
    flex: 1,
    lineHeight: wp(5),
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: wp(2),
    gap: wp('2%'),
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp(1),
  },
  statusButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(0.8),
    borderRadius: wp(10),
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
  itemImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  itemImageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  itemImageContainer: {
    width: wp(15),
    height: wp(15),
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.royalBlue,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },

  removeImageButton: {
    position: 'absolute',
    right: -2,
    top: -2,
  },
  removeImageButtonWithImage: {
    right: -5,
    top: -5,
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
    width: wp(24),
    height: hp(11),
    borderRadius: wp(2),
    borderWidth: 1.3,
    borderColor: '#D1E3F7',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureImageBoxWithImage: {
    borderStyle: 'solid',
  },
  captureImageText: {
    fontSize: wp(2.8),
    color: colors.royalBlue,
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
  tireGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: hp(1.5),
  },
  modalOverlay: {
    flexGrow: 1,
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
    borderRadius: wp(100),
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
    justifyContent: 'space-around',
    flexDirection: 'row-reverse',
  },
  cardItems: {gap: wp(2.5)},
  // TIRES
  tiresContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },
  truckWithTiresContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(40),
  },
  truckDiagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tirePositionContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
    gap: wp(5),
  },
  // Precise positioning for each tire over the truck image
  frontLeftPosition: {
    top: hp(3.2),
    left: -wp(0),
  },
  frontRightPosition: {
    top: hp(3.2),
    right: wp(0),
  },
  rearLeftPosition: {
    bottom: hp(2.5),
    left: wp(0),
  },
  rearRightPosition: {
    bottom: hp(2.5),
    right: -wp(0),
  },
  tireCaptureBox: {
    width: wp(26),
    height: hp(10),
    borderRadius: wp(2),
    borderWidth: 1.3,
    borderColor: '#D1E3F7',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    marginBottom: hp(0.5),
    position: 'relative',
  },
  tireCaptureImageBox: {
    borderStyle: 'solid',
  },
  tireIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(0.3),
  },
  tireImageContainer: {
    width: '100%',
    height: '100%',
    marginBottom: hp(0),
  },
  tireIcon: {
    width: wp(8),
    height: wp(8),
  },
  tireImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
  },

  cameraIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  tireCaptureText: {
    fontSize: wp(2.8),
    color: colors.royalBlue,
    textAlign: 'center',
    fontWeight: '500',
  },
  tireLabel: {
    fontSize: wp(2.8),
    color: '#333333',
    textAlign: 'center',
    fontWeight: '600',
    maxWidth: wp(26),
  },
  overlayBox: {
    position: 'absolute',
    top: hp(0.8),
    left: wp(2),
    backgroundColor: colors.royalBlue,
    borderRadius: wp(0.8),
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.8),
    zIndex: 15,
  },
  overlayText: {
    color: colors.white,
    fontSize: wp(2.2),
    fontWeight: '600',
  },
  bottomTiresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: wp(4),
    gap: wp(4),
    marginTop: hp(3),
  },
  bottomTireItem: {
    flex: 1,
    alignItems: 'center',
    maxWidth: wp(40),
  },
  captureImageStyle: {
    width: wp('14%'),
    height: wp('14%'),
  },
  captureImageStyleWithImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
  },
  captureImageBoxIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  truckBodyImage: {
    width: wp(50),
    height: hp(40),
  },
  captureFrameTitle: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  captureFrameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
  },
  rotateChevron: {transform: [{rotate: '180deg'}]},
  loadingContainer: {alignSelf: 'center'},
});

export default DVIRInspectionChecklistScreen;
