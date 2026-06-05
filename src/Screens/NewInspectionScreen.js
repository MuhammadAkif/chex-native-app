import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { BackArrow } from '../Assets/Icons';
import { colors, NewInspectionStyles } from '../Assets/Styles';
import {
  AndroidMediaViewModal,
  CaptureImageModal,
  CarVerificationExpandedCard,
  CollapsedCard,
  ConfirmVehicleDetailModal,
  DiscardInspectionModal,
  DisplayMediaModal,
  HeaderBackground,
  HeaderTitle,
  LogoHeader,
  MileageInput,
  MileageSection,
  NewInspectionFooter,
  TiresItemsExpandedCard,
} from '../Components';
import { ROUTES } from '../Navigation/ROUTES';
import AnnotateImage from '../Components/Annotation/AnnotateImage';
import AnnotateImageModal from '../Components/Annotation/AnnotateImageModal';
import LoadingIndicator from '../Components/LoadingIndicator';
import { hasInteriorAndRoofTopCompany } from '../Constants';
import { useTranslation } from 'react-i18next';

const { OS } = Platform;
const mediaViewModals = {
  ios: DisplayMediaModal,
  android: AndroidMediaViewModal,
};
const ActiveMediaViewModal = mediaViewModals[OS];
const { black, orange, white } = colors;
const { container, headerContainer, headerTitleText, backIconContainer, bodyContainer, innerBody, scrollViewContainer } = NewInspectionStyles;

const NewInspectionScreen = props => {
  const { t } = useTranslation();
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
    displayInstructions,
    imageDimensions,
    companyId,
    interiorItemsConfig,
    exteriorItemsConfig,
    tiresItemsConfig,
  } = props;
  return (
    <View style={container}>
      {isDiscardInspectionModalVisible && (
        <DiscardInspectionModal
          onNoPress={onNoPress}
          onYesPress={onYesPress}
          description={t('newInspection.discardItem')}
          noButtonText={{ color: black }}
          noButtonStyle={{ borderColor: orange }}
        />
      )}
      {/* {isInspectionInProgressModalVisible && (
        <View>
          <DiscardInspectionModal onYesPress={handleYesPressOfInProgressInspection} description={errorTitle} dualButton={false} />
        </View>
      )} */}
      {inUseErrorTitle && (
        <DiscardInspectionModal
          yesButtonText={t('common.ok')}
          onYesPress={handleBackPress}
          description={inUseErrorTitle}
          dualButton={false}
        />
      )}
      <MileageInput />
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
          imageDimensions={imageDimensions}
        />
      )}

      <LogoHeader />
      <View style={headerContainer}>
        <Text style={headerTitleText}>{t('newInspection.header')}</Text>
      </View>

      <View style={bodyContainer}>
        <View style={innerBody}>
          <ScrollView
            contentContainerStyle={scrollViewContainer}
            showsVerticalScrollIndicator={false}>
            {/* Optional odometer/mileage capture — sits at the top of the list */}
            <MileageSection returnTo={ROUTES.NEW_INSPECTION} index={1} />
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
            {/* <CollapsedCard
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
            )} */}
            {!hasInteriorAndRoofTopCompany(companyId) && interiorItemsConfig.length > 0 && (
              <>
                <CollapsedCard
                  text={t('newInspection.interiorItems')}
                  index={2}
                  displayInstructions={displayInstructions}
                  isActive={selectedOption?.isInterior}
                  isBothItemsAvailable={isAllInteriorImagesAvailable}
                  onPress={() => handleCardExpansion('isInterior')}
                // disabled={!isLicensePlateUploaded}
                />
                {selectedOption?.isInterior && (
                  <ActiveInteriorItemsExpandedCard
                    handleItemPickerPress={handleItemPickerPress}
                    interiorItems={interiorItems}
                    handleCrossPress={handleOnCrossPress}
                    isLoading={isLoading}
                    handleMediaModalDetailsPress={handleMediaModalDetailsPress}
                    interiorItemsConfig={interiorItemsConfig}
                  />
                )}
              </>
            )}
            {exteriorItemsConfig.length > 0 && (
            <CollapsedCard
              text={t('newInspection.exteriorItems')}
              displayInstructions={displayInstructions}
              index={hasInteriorAndRoofTopCompany(companyId) ? 2 : 3}
              isActive={selectedOption?.isExterior}
              isBothItemsAvailable={isAllExteriorImagesAvailable}
              onPress={() => handleCardExpansion('isExterior')}
            // disabled={!isLicensePlateUploaded}
            />
            )}
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
                companyId={companyId}
                exteriorItemsConfig={exteriorItemsConfig}
              />
            )}
            {displayTires && tiresItemsConfig.length > 0 && (
              <>
                <CollapsedCard
                  text={t('newInspection.tires')}
                  index={hasInteriorAndRoofTopCompany(companyId) ? 3 : 4}
                  isActive={selectedOption?.isTires}
                  isBothItemsAvailable={isBothTiresImagesAvailable}
                  onPress={() => handleCardExpansion('isTires')}
                // disabled={!isLicensePlateUploaded}
                />
                {selectedOption?.isTires && (
                  <TiresItemsExpandedCard
                    handleItemPickerPress={handleItemPickerPress}
                    tires={tires}
                    handleCrossPress={handleOnCrossPress}
                    isLoading={isLoading}
                    handleMediaModalDetailsPress={handleMediaModalDetailsPress}
                    tiresItemsConfig={tiresItemsConfig}
                  />
                )}
              </>
            )}
          </ScrollView>
        </View>
        <NewInspectionFooter onSubmitPress={handleSubmitPress} isLoading={isLoading} submitVisible={isVehicleAllPartsImagesAvailable} />
      </View>
      <LoadingIndicator isLoading={isLoading} />
    </View>
  );
};

export default NewInspectionScreen;
