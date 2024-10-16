import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  CollapsedCard,
  CarVerificationExpandedCard,
  CaptureImageModal,
  TiresItemsExpandedCard,
  PrimaryGradientButton,
  DisplayMediaModal,
  DiscardInspectionModal,
  AndroidMediaViewModal,
  ConfirmVehicleDetailModal,
} from '../Components';
import {BackArrow} from '../Assets/Icons';
import LoadingIndicator from '../Components/LoadingIndicator';
import AnnotateImageModal from '../Components/Annotation/AnnotateImageModal';
import AnnotateImage from '../Components/Annotation/AnnotateImage';

const mediaViewModals = {
  ios: DisplayMediaModal,
  android: AndroidMediaViewModal,
};
const ActiveMediaViewModal = mediaViewModals[Platform.OS];
const {black, orange, white} = colors;

const NewInspectionScreen = props => {
  const {
    selectedOption,
    modalVisible,
    handleModalVisible,
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
    handleItemPickerPress,
    handleCaptureNowPress,
    carVerificiationItems,
    interiorItems,
    exteriorItems,
    tires,
    isBothCarVerificationImagesAvailable,
    isAllInteriorImagesAvailable,
    isAllExteriorImagesAvailable,
    isBothTiresImagesAvailable,
    isVehicleAllPartsImagesAvailable,
    handleSubmitPress,
    isLoading,
    handleMediaModalDetailsPress,
    handleMediaModalDetailsCrossPress,
    mediaModalDetails,
    mediaModalVisible,
    handleOnCrossPress,
    onNoPress,
    onYesPress,
    isDiscardInspectionModalVisible,
    handleBackPress,
    isLicenseModalVisible,
    handleConfirmModalVisible,
    handleConfirmVehicleDetail,
    plateNumber,
    errorTitle,
    handleYesPressOfInProgressInspection,
    isInspectionInProgressModalVisible,
    inUseErrorTitle,
    skipLeft,
    skipLeftCorners,
    skipRight,
    skipRightCorners,
    displayTires,
    handleCardExpansion,
    loadingIndicator,
    displayAnnotationPopUp,
    handleSkipPress,
    handleAnnotatePress,
    displayAnnotation,
    handleAnnotationSubmit,
    handleAnnotationCancel,
    annotationModalDetails,
    isLicensePlateUploaded,
    ActiveExteriorItemsExpandedCard,
    vehicle_Type,
    ActiveInteriorItemsExpandedCard,
    coordinates,
  } = props;
  return (
    <View style={NewInspectionStyles.container}>
      {isDiscardInspectionModalVisible && (
        <DiscardInspectionModal
          onNoPress={onNoPress}
          onYesPress={onYesPress}
          description={'Are you sure you want to delete this inspection item?'}
          noButtonText={{color: black}}
          noButtonStyle={{borderColor: orange}}
        />
      )}
      {isInspectionInProgressModalVisible && (
        <DiscardInspectionModal
          onYesPress={handleYesPressOfInProgressInspection}
          description={errorTitle}
          dualButton={false}
        />
      )}
      {inUseErrorTitle && (
        <DiscardInspectionModal
          yesButtonText={'Ok'}
          onYesPress={handleBackPress}
          description={inUseErrorTitle}
          dualButton={false}
        />
      )}
      {isLicenseModalVisible && (
        <ConfirmVehicleDetailModal
          isLoading={isLoading}
          onCrossPress={handleConfirmModalVisible}
          onConfirmPress={handleConfirmVehicleDetail}
          numberPlateText={plateNumber || ''}
          textLimit={20}
          textLength={plateNumber?.length || '0'}
        />
      )}
      {vehicle_Type && (
        <AnnotateImageModal
          modalVisible={displayAnnotationPopUp}
          handleSkipPress={handleSkipPress}
          handleAnnotatePress={handleAnnotatePress}
          source={annotationModalDetails.source}
          title={annotationModalDetails.title}
        />
      )}
      {vehicle_Type && (
        <AnnotateImage
          modalVisible={displayAnnotation}
          handleSubmit={handleAnnotationSubmit}
          handleCancel={handleAnnotationCancel}
          source={annotationModalDetails.uri}
          title={annotationModalDetails.title}
          isLoading={isLoading}
        />
      )}
      <View style={NewInspectionStyles.headerContainer}>
        <Text style={NewInspectionStyles.headerTitleText}>
          Please complete inspection items within each category below
        </Text>
      </View>
      <TouchableOpacity
        style={NewInspectionStyles.backIconContainer}
        onPress={handleBackPress}>
        <BackArrow height={hp('3%')} width={wp('7%')} color={white} />
      </TouchableOpacity>
      <View style={NewInspectionStyles.bodyContainer}>
        <View style={NewInspectionStyles.innerBody}>
          <ScrollView
            contentContainerStyle={NewInspectionStyles.scrollViewContainer}
            showsVerticalScrollIndicator={false}>
            {modalVisible && (
              <CaptureImageModal
                modalVisible={modalVisible}
                handleVisible={handleModalVisible}
                source={source}
                instructionalText={instructionalText}
                buttonText={buttonText}
                title={title}
                isVideo={isVideo}
                instructionalSubHeadingText={instructionalSubHeadingText || ''}
                instructionalSubHeadingText_1={
                  instructionalSubHeadingText_1 || ''
                }
                instructionalSubHeadingText_2={
                  instructionalSubHeadingText_2 || ''
                }
                modalKey={modalKey}
                handleCaptureImage={handleCaptureNowPress}
                isCarVerification={isCarVerification}
                isExterior={isExterior || isInterior}
              />
            )}
            {mediaModalVisible && (
              <ActiveMediaViewModal
                title={mediaModalDetails?.title}
                isVideo={mediaModalDetails?.isVideo}
                source={mediaModalDetails?.source}
                coordinates={coordinates}
                handleVisible={handleMediaModalDetailsCrossPress}
              />
            )}
            <CollapsedCard
              text={'Car Verification items'}
              index={1}
              isActive={selectedOption?.isCarVerification}
              isBothItemsAvailable={isBothCarVerificationImagesAvailable}
              onPress={() => handleCardExpansion('isCarVerification')}
            />
            {selectedOption?.isCarVerification && (
              <CarVerificationExpandedCard
                handleItemPickerPress={handleItemPickerPress}
                carVerificiationItems={carVerificiationItems}
                handleCrossPress={handleOnCrossPress}
                isLoading={isLoading}
                handleMediaModalDetailsPress={handleMediaModalDetailsPress}
                isLicensePlateUploaded={!isLicensePlateUploaded}
              />
            )}
            <CollapsedCard
              text={'Interior items'}
              index={2}
              isActive={selectedOption?.isInterior}
              isBothItemsAvailable={isAllInteriorImagesAvailable}
              onPress={() => handleCardExpansion('isInterior')}
              disabled={!isLicensePlateUploaded}
            />
            {selectedOption?.isInterior && (
              <ActiveInteriorItemsExpandedCard
                handleItemPickerPress={handleItemPickerPress}
                interiorItems={interiorItems}
                handleCrossPress={handleOnCrossPress}
                isLoading={isLoading}
                handleMediaModalDetailsPress={handleMediaModalDetailsPress}
              />
            )}
            <CollapsedCard
              text={'Exterior items'}
              index={3}
              isActive={selectedOption?.isExterior}
              isBothItemsAvailable={isAllExteriorImagesAvailable}
              onPress={() => handleCardExpansion('isExterior')}
              disabled={!isLicensePlateUploaded}
            />
            {selectedOption?.isExterior && (
              <ActiveExteriorItemsExpandedCard
                handleItemPickerPress={handleItemPickerPress}
                exteriorItems={exteriorItems}
                handleCrossPress={handleOnCrossPress}
                isLoading={isLoading}
                skipLeft={skipLeft}
                skipLeftCorners={skipLeftCorners}
                skipRight={skipRight}
                skipRightCorners={skipRightCorners}
                handleMediaModalDetailsPress={handleMediaModalDetailsPress}
              />
            )}
            {displayTires && (
              <>
                <CollapsedCard
                  text={'Tires'}
                  index={4}
                  isActive={selectedOption?.isTires}
                  isBothItemsAvailable={isBothTiresImagesAvailable}
                  onPress={() => handleCardExpansion('isTires')}
                  disabled={!isLicensePlateUploaded}
                />
                {selectedOption?.isTires && (
                  <TiresItemsExpandedCard
                    handleItemPickerPress={handleItemPickerPress}
                    tires={tires}
                    handleCrossPress={handleOnCrossPress}
                    isLoading={isLoading}
                    handleMediaModalDetailsPress={handleMediaModalDetailsPress}
                  />
                )}
              </>
            )}
          </ScrollView>
        </View>
        {isVehicleAllPartsImagesAvailable && (
          <View style={NewInspectionStyles.footerContainer}>
            <PrimaryGradientButton
              text={'Submit'}
              onPress={handleSubmitPress}
              disabled={isLoading}
            />
          </View>
        )}
      </View>
      <LoadingIndicator isLoading={loadingIndicator} />
    </View>
  );
};

export default NewInspectionScreen;
