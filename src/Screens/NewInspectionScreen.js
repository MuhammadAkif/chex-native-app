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
  ExteriorItemsExpandedCard,
  TiresItemsExpandedCard,
  PrimaryGradientButton,
  DisplayMediaModal,
  DiscardInspectionModal,
  Toast,
  AndroidMediaViewModal,
  ConfirmVehicleDetailModal,
} from '../Components';
import {BackArrow} from '../Assets/Icons';
import {ANDROID} from '../Constants';

const NewInspectionScreen = ({
  selectedOption,
  handleCarVerificationSelection,
  handleExteriorSelection,
  handleTiresSelection,
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
  instructionalSubHeadingText,
  handleItemPickerPress,
  handleCaptureNowPress,
  carVerificationItems,
  exteriorItems,
  tires,
  isBothCarVerificationImagesAvailable,
  isAllExteriorImagesAvailable,
  isBothTiresImagesAvailable,
  isVehicleAllPartsImagesAvailable,
  handleSubmitPress,
  isLoading,
  submitText,
  handleMediaModalDetailsPress,
  handleMediaModalDetailsCrossPress,
  mediaModalDetails,
  mediaModalVisible,
  handleOnCrossPress,
  onNoPress,
  onYesPress,
  isDiscardInspectionModalVisible,
  handleBackPress,
  modalMessageDetails,
  handleOkPress,
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
}) => (
  <View style={NewInspectionStyles.container}>
    {isDiscardInspectionModalVisible && (
      <DiscardInspectionModal
        onNoPress={onNoPress}
        onYesPress={onYesPress}
        description={'Are you sure you want to delete this inspection item?'}
        noButtonText={{color: colors.black}}
        noButtonStyle={{borderColor: colors.orange}}
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
      />
    )}
    {modalMessageDetails.isVisible && (
      <Toast
        onCrossPress={handleOkPress}
        isVisible={modalMessageDetails.isVisible}
        message={modalMessageDetails.message}
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
      <BackArrow height={hp('3%')} width={wp('7%')} color={colors.white} />
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
              instructionalSubHeadingText={instructionalSubHeadingText}
              modalKey={modalKey}
              handleCaptureImage={handleCaptureNowPress}
              isCarVerification={isCarVerification}
              isExterior={isExterior}
            />
          )}
          {Platform.OS === 'ios' && mediaModalVisible && (
            <DisplayMediaModal
              title={mediaModalDetails?.title}
              isVideo={mediaModalDetails?.isVideo}
              source={mediaModalDetails?.source}
              handleVisible={handleMediaModalDetailsCrossPress}
            />
          )}
          {Platform.OS === ANDROID && mediaModalVisible && (
            <AndroidMediaViewModal
              handleVisible={handleMediaModalDetailsCrossPress}
              title={mediaModalDetails?.title}
              isVideo={mediaModalDetails?.isVideo}
              source={mediaModalDetails?.source}
            />
          )}
          <CollapsedCard
            text={'Car Verification items'}
            index={1}
            isActive={selectedOption?.isCarVerification}
            isBothItemsAvailable={isBothCarVerificationImagesAvailable}
            onPress={handleCarVerificationSelection}
          />
          {selectedOption?.isCarVerification && (
            <CarVerificationExpandedCard
              handleItemPickerPress={handleItemPickerPress}
              carVerificationItems={carVerificationItems}
              handleCrossPress={handleOnCrossPress}
              isLoading={isLoading}
              handleMediaModalDetailsPress={handleMediaModalDetailsPress}
            />
          )}
          <CollapsedCard
            text={'Exterior items'}
            index={2}
            isActive={selectedOption?.isExterior}
            isBothItemsAvailable={isAllExteriorImagesAvailable}
            onPress={handleExteriorSelection}
          />
          {selectedOption?.isExterior && (
            <ExteriorItemsExpandedCard
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
          <CollapsedCard
            text={'Tires'}
            index={3}
            isActive={selectedOption?.isTires}
            isBothItemsAvailable={isBothTiresImagesAvailable}
            onPress={handleTiresSelection}
          />
          {selectedOption?.isTires && (
            // {selectedOption?.isTires && displayTires && (
            <TiresItemsExpandedCard
              handleItemPickerPress={handleItemPickerPress}
              tires={tires}
              handleCrossPress={handleOnCrossPress}
              isLoading={isLoading}
              handleMediaModalDetailsPress={handleMediaModalDetailsPress}
            />
          )}
        </ScrollView>
      </View>
      {isVehicleAllPartsImagesAvailable && (
        <View style={NewInspectionStyles.footerContainer}>
          <PrimaryGradientButton
            text={submitText}
            onPress={handleSubmitPress}
            disabled={isLoading}
          />
        </View>
      )}
    </View>
  </View>
);

export default NewInspectionScreen;
