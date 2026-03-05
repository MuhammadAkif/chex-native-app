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

const EXTERIOR_CATEGORY_NAMES = {
  FRONT: 'exterior_front',
  REAR: 'exterior_rear',
  FRONT_LEFT_CORNER: 'front_left_corner',
  FRONT_RIGHT_CORNER: 'front_right_corner',
  REAR_LEFT_CORNER: 'rear_left_corner',
  REAR_RIGHT_CORNER: 'rear_right_corner',
  INSIDE_CARGO_ROOF: 'inside_cargo_roof',
};

const hasCategory = (array, categoryName) =>
  array.some(item => item?.categoryName === categoryName);

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
  exteriorItemsConfig = [],
}) => {
  const {
    user: {
      data: {companyId},
    },
  } = useSelector(state => state?.auth);
  const {selectedVehicleKind} = useSelector(state => state?.newInspection);

  const hasExteriorConfig = exteriorItemsConfig.length > 0;
  const showFront = !hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.FRONT);
  const showRear = !hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.REAR);
  const showFrontLeftCorner = (!hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.FRONT_LEFT_CORNER)) && !skipLeftCorners;
  const showFrontRightCorner = (!hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.FRONT_RIGHT_CORNER)) && !skipRightCorners;
  const showRearLeftCorner = (!hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.REAR_LEFT_CORNER)) && !skipLeftCorners;
  const showRearRightCorner = (!hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.REAR_RIGHT_CORNER)) && !skipRightCorners;
  const showInsideCargoRoof = (!hasExteriorConfig || hasCategory(exteriorItemsConfig, EXTERIOR_CATEGORY_NAMES.INSIDE_CARGO_ROOF)) && !hasInteriorAndRoofTopCompany(companyId);

  const showFirstRow = showFront || showRear;
  const showCornersRow1 = showFrontLeftCorner || showFrontRightCorner;
  const showCornersRow2 = showRearLeftCorner || showRearRightCorner;

  return (
    <View style={[expandedCardContainer, container]}>
      {showFirstRow && (
        <View style={itemPickerContainer}>
          {showFront && (
            <ImagePicker
              text={ExteriorFrontDetails(selectedVehicleKind).title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorFront}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(ExteriorFrontDetails(selectedVehicleKind))}
              onClearPress={() => handleCrossPress(ExteriorFrontDetails(selectedVehicleKind).groupType, ExteriorFrontDetails(selectedVehicleKind).key)}
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(ExteriorFrontDetails(selectedVehicleKind).title, exteriorItems?.exteriorFront)
              }
            />
          )}
          {showRear && (
            <ImagePicker
              text={ExteriorRearDetails(selectedVehicleKind).title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorRear}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(ExteriorRearDetails(selectedVehicleKind))}
              onClearPress={() => handleCrossPress(ExteriorRearDetails(selectedVehicleKind).groupType, ExteriorRearDetails(selectedVehicleKind).key)}
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(ExteriorRearDetails(selectedVehicleKind).title, exteriorItems?.exteriorRear)
              }
            />
          )}
        </View>
      )}
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
      {showCornersRow1 && (
        <View style={itemPickerContainer}>
          {showFrontLeftCorner && (
            <ImagePicker
              text={ExteriorFrontLeftCornerDetails(selectedVehicleKind).title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorFrontLeftCorner}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(ExteriorFrontLeftCornerDetails(selectedVehicleKind))}
              onClearPress={() =>
                handleCrossPress(ExteriorFrontLeftCornerDetails(selectedVehicleKind).groupType, ExteriorFrontLeftCornerDetails(selectedVehicleKind).key)
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(ExteriorFrontLeftCornerDetails(selectedVehicleKind).title, exteriorItems?.exteriorFrontLeftCorner)
              }
            />
          )}
          {showFrontRightCorner && (
            <ImagePicker
              text={ExteriorFrontRightCornerDetails(selectedVehicleKind).title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorFrontRightCorner}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(ExteriorFrontRightCornerDetails(selectedVehicleKind))}
              onClearPress={() =>
                handleCrossPress(
                  ExteriorFrontRightCornerDetails(selectedVehicleKind).groupType,
                  ExteriorFrontRightCornerDetails(selectedVehicleKind).key
                )
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(ExteriorFrontRightCornerDetails(selectedVehicleKind).title, exteriorItems?.exteriorFrontRightCorner)
              }
            />
          )}
        </View>
      )}
      {showCornersRow2 && (
        <View style={itemPickerContainer}>
          {showRearLeftCorner && (
            <ImagePicker
              text={ExteriorRearLeftCornerDetails(selectedVehicleKind).title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorRearLeftCorner}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(ExteriorRearLeftCornerDetails(selectedVehicleKind))}
              onClearPress={() =>
                handleCrossPress(ExteriorRearLeftCornerDetails(selectedVehicleKind).groupType, ExteriorRearLeftCornerDetails(selectedVehicleKind).key)
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(ExteriorRearLeftCornerDetails(selectedVehicleKind).title, exteriorItems?.exteriorRearLeftCorner)
              }
            />
          )}
          {showRearRightCorner && (
            <ImagePicker
              text={ExteriorRearRightCornerDetails(selectedVehicleKind).title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorRearRightCorner}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(ExteriorRearRightCornerDetails(selectedVehicleKind))}
              onClearPress={() =>
                handleCrossPress(ExteriorRearRightCornerDetails(selectedVehicleKind).groupType, ExteriorRearRightCornerDetails(selectedVehicleKind).key)
              }
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(ExteriorRearRightCornerDetails(selectedVehicleKind).title, exteriorItems?.exteriorRearRightCorner)
              }
            />
          )}
        </View>
      )}
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

      {showInsideCargoRoof && (
        <View style={itemPickerContainer}>
          <ImagePicker
            text={ExteriorInsideCargoRoofDetails(selectedVehicleKind).title}
            pickerText={pickerText}
            imageURL={exteriorItems?.exteriorInsideCargoRoof}
            isLoading={isLoading}
            onPress={() => handleItemPickerPress(ExteriorInsideCargoRoofDetails(selectedVehicleKind))}
            onClearPress={() =>
              handleCrossPress(ExteriorInsideCargoRoofDetails(selectedVehicleKind).groupType, ExteriorInsideCargoRoofDetails(selectedVehicleKind).key)
            }
            handleMediaModalDetailsPress={() =>
              handleMediaModalDetailsPress(ExteriorInsideCargoRoofDetails(selectedVehicleKind).title, exteriorItems?.exteriorInsideCargoRoof)
            }
          />
        </View>
      )}
    </View>
  );
};

export default ExteriorItemsExpandedCard;
