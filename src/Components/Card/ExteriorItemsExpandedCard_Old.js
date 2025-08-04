import React from 'react';
import {View} from 'react-native';

import {useSelector} from 'react-redux';
import {ExpandedCardStyles, expandedCardStyles} from '../../Assets/Styles';
import {hasInteriorAndRoofTopCompany} from '../../Constants';
import {
  ExteriorFrontDetails,
  ExteriorFrontLeftCornerDetails,
  ExteriorFrontRightCornerDetails,
  ExteriorInsideCargoRoofDetails,
  ExteriorRearDetails,
  ExteriorRearLeftCornerDetails,
  ExteriorRearRightCornerDetails,
} from '../../Utils';
import {ImagePicker} from '../index';

const {expandedCardContainer} = expandedCardStyles;
const {container, itemPickerContainer} = ExpandedCardStyles;

const ExteriorItemsExpandedCard = ({
  handleItemPickerPress,
  exteriorItems,
  handleCrossPress,
  isLoading,
  handleMediaModalDetailsPress,
  pickerText = 'Capture Image',
  skipLeft = false,
  skipLeftCorners = false,
  skipRight = false,
  skipRightCorners = false,
}) => {
  const {
    user: {
      data: {companyId},
    },
  } = useSelector(state => state?.auth);
  return (
    <View style={[expandedCardContainer, container]}>
      <View style={itemPickerContainer}>
        <ImagePicker
          text={ExteriorFrontDetails.title}
          pickerText={pickerText}
          imageURL={exteriorItems?.exteriorFront}
          isLoading={isLoading}
          onPress={() => handleItemPickerPress(ExteriorFrontDetails)}
          onClearPress={() => handleCrossPress(ExteriorFrontDetails.groupType, ExteriorFrontDetails.key)}
          handleMediaModalDetailsPress={() => handleMediaModalDetailsPress(ExteriorFrontDetails.title, exteriorItems?.exteriorFront)}
        />
        <ImagePicker
          text={ExteriorRearDetails.title}
          pickerText={pickerText}
          imageURL={exteriorItems?.exteriorRear}
          isLoading={isLoading}
          onPress={() => handleItemPickerPress(ExteriorRearDetails)}
          onClearPress={() => handleCrossPress(ExteriorRearDetails.groupType, ExteriorRearDetails.key)}
          handleMediaModalDetailsPress={() => handleMediaModalDetailsPress(ExteriorRearDetails.title, exteriorItems?.exteriorRear)}
        />
      </View>
      {/*<View style={itemPickerContainer}>*/}
      {/*  {!skipLeft && (*/}
      {/*    <ImagePicker*/}
      {/*      text={ExteriorLeftDetails.title}*/}
      {/*      pickerText={pickerText}*/}
      {/*      imageURL={exteriorItems?.exteriorLeft}*/}
      {/*      isLoading={isLoading}*/}
      {/*      onPress={() => handleItemPickerPress(ExteriorLeftDetails)}*/}
      {/*      onClearPress={() =>*/}
      {/*        handleCrossPress(*/}
      {/*          ExteriorLeftDetails.groupType,*/}
      {/*          ExteriorLeftDetails.key,*/}
      {/*        )*/}
      {/*      }*/}
      {/*      handleMediaModalDetailsPress={() =>*/}
      {/*        handleMediaModalDetailsPress(*/}
      {/*          ExteriorLeftDetails.title,*/}
      {/*          exteriorItems?.exteriorLeft,*/}
      {/*        )*/}
      {/*      }*/}
      {/*    />*/}
      {/*  )}*/}
      {/*  {!skipRight && (*/}
      {/*    <ImagePicker*/}
      {/*      text={ExteriorRightDetails.title}*/}
      {/*      pickerText={pickerText}*/}
      {/*      imageURL={exteriorItems?.exteriorRight}*/}
      {/*      isLoading={isLoading}*/}
      {/*      onPress={() => handleItemPickerPress(ExteriorRightDetails)}*/}
      {/*      onClearPress={() =>*/}
      {/*        handleCrossPress(*/}
      {/*          ExteriorRightDetails.groupType,*/}
      {/*          ExteriorRightDetails.key,*/}
      {/*        )*/}
      {/*      }*/}
      {/*      handleMediaModalDetailsPress={() =>*/}
      {/*        handleMediaModalDetailsPress(*/}
      {/*          ExteriorRightDetails.title,*/}
      {/*          exteriorItems?.exteriorRight,*/}
      {/*        )*/}
      {/*      }*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</View>*/}
      <View style={itemPickerContainer}>
        {!skipLeftCorners && (
          <ImagePicker
            text={ExteriorFrontLeftCornerDetails.title}
            pickerText={pickerText}
            imageURL={exteriorItems?.exteriorFrontLeftCorner}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(ExteriorFrontLeftCornerDetails)}
            onClearPress={() => handleCrossPress(ExteriorFrontLeftCornerDetails.groupType, ExteriorFrontLeftCornerDetails.key)}
            handleMediaModalDetailsPress={() =>
              handleMediaModalDetailsPress(ExteriorFrontLeftCornerDetails.title, exteriorItems?.exteriorFrontLeftCorner)
            }
          />
        )}
        {!skipRightCorners && (
          <ImagePicker
            text={ExteriorFrontRightCornerDetails.title}
            pickerText={pickerText}
            imageURL={exteriorItems?.exteriorFrontRightCorner}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(ExteriorFrontRightCornerDetails)}
            onClearPress={() => handleCrossPress(ExteriorFrontRightCornerDetails.groupType, ExteriorFrontRightCornerDetails.key)}
            handleMediaModalDetailsPress={() =>
              handleMediaModalDetailsPress(ExteriorFrontRightCornerDetails.title, exteriorItems?.exteriorFrontRightCorner)
            }
          />
        )}
      </View>
      <View style={itemPickerContainer}>
        {!skipLeftCorners && (
          <ImagePicker
            text={ExteriorRearLeftCornerDetails.title}
            pickerText={pickerText}
            imageURL={exteriorItems?.exteriorRearLeftCorner}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(ExteriorRearLeftCornerDetails)}
            onClearPress={() => handleCrossPress(ExteriorRearLeftCornerDetails.groupType, ExteriorRearLeftCornerDetails.key)}
            handleMediaModalDetailsPress={() =>
              handleMediaModalDetailsPress(ExteriorRearLeftCornerDetails.title, exteriorItems?.exteriorRearLeftCorner)
            }
          />
        )}
        {!skipRightCorners && (
          <ImagePicker
            text={ExteriorRearRightCornerDetails.title}
            pickerText={pickerText}
            imageURL={exteriorItems?.exteriorRearRightCorner}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(ExteriorRearRightCornerDetails)}
            onClearPress={() => handleCrossPress(ExteriorRearRightCornerDetails.groupType, ExteriorRearRightCornerDetails.key)}
            handleMediaModalDetailsPress={() =>
              handleMediaModalDetailsPress(ExteriorRearRightCornerDetails.title, exteriorItems?.exteriorRearRightCorner)
            }
          />
        )}
      </View>
      {/*<View style={itemPickerContainer}>*/}
      {/*    <ImagePicker*/}
      {/*      text={ExteriorInteriorDriverSide.title}*/}
      {/*      pickerText={pickerText}*/}
      {/*      imageURL={exteriorItems?.exteriorInteriorDriverSide}*/}
      {/*      isLoading={isLoading}*/}
      {/*      onPress={() => handleItemPickerPress(ExteriorInteriorDriverSide)}*/}
      {/*      onClearPress={() =>*/}
      {/*        handleCrossPress(*/}
      {/*          ExteriorInteriorDriverSide.groupType,*/}
      {/*          ExteriorInteriorDriverSide.key,*/}
      {/*        )*/}
      {/*      }*/}
      {/*      handleMediaModalDetailsPress={() =>*/}
      {/*        handleMediaModalDetailsPress(*/}
      {/*          ExteriorInteriorDriverSide.title,*/}
      {/*          exteriorItems?.exteriorInteriorDriverSide,*/}
      {/*        )*/}
      {/*      }*/}
      {/*    />*/}
      {/*  <ImagePicker*/}
      {/*    text={ExteriorInteriorPassengerSide.title}*/}
      {/*    pickerText={pickerText}*/}
      {/*    imageURL={exteriorItems?.exteriorInteriorPassengerSide}*/}
      {/*    isLoading={isLoading}*/}
      {/*    onPress={() => handleItemPickerPress(ExteriorInteriorPassengerSide)}*/}
      {/*    onClearPress={() =>*/}
      {/*      handleCrossPress(*/}
      {/*        ExteriorInteriorPassengerSide.groupType,*/}
      {/*        ExteriorInteriorPassengerSide.key,*/}
      {/*      )*/}
      {/*    }*/}
      {/*    handleMediaModalDetailsPress={() =>*/}
      {/*      handleMediaModalDetailsPress(*/}
      {/*        ExteriorInteriorPassengerSide.title,*/}
      {/*        exteriorItems?.exteriorInteriorPassengerSide,*/}
      {/*      )*/}
      {/*    }*/}
      {/*  />*/}
      {/*</View>*/}

      {!hasInteriorAndRoofTopCompany(companyId) && (
        <View style={itemPickerContainer}>
          <ImagePicker
            text={ExteriorInsideCargoRoofDetails.title}
            pickerText={pickerText}
            imageURL={exteriorItems?.exteriorInsideCargoRoof}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(ExteriorInsideCargoRoofDetails)}
            onClearPress={() => handleCrossPress(ExteriorInsideCargoRoofDetails.groupType, ExteriorInsideCargoRoofDetails.key)}
            handleMediaModalDetailsPress={() =>
              handleMediaModalDetailsPress(ExteriorInsideCargoRoofDetails.title, exteriorItems?.exteriorInsideCargoRoof)
            }
          />
        </View>
      )}
    </View>
  );
};

export default ExteriorItemsExpandedCard;
