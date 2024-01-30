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
} from '../Components';
import {BackArrow} from '../Assets/Icons';

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
  instructionalSubHeadingText,
  handleItemPickerPress,
  handleCaptureNowPress,
  carVerificationItems,
  exteriorItems,
  tires,
  handleCarVerificationCrossPress,
  handleExteriorCrossPress,
  handleTiresCrossPress,
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
      {/*<View style={NewInspectionStyles.bodyHeaderContainer}>*/}
      {/*  <Text style={NewInspectionStyles.bodyHeaderTitleText}>*/}
      {/*    Please use mobile phone for optimal performance*/}
      {/*  </Text>*/}
      {/*</View>*/}
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
          {Platform.OS === 'android' && mediaModalVisible && (
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
