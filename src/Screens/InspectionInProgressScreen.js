import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  DiscardInspectionModal,
  PrimaryStartInspectionButton,
  RenderInspectionInProgress,
} from '../Components';
import {colors, NewInspectionStyles, ShadowEffect} from '../Assets/Styles';
import {handleHomePress} from '../Utils';

const {black, white, royalBlue} = colors;
const {
  container,
  bodyContainer,
  bodyHeaderContainer,
  bodyHeaderTitleText,
  innerBody,
} = NewInspectionStyles;

const InspectionInProgressScreen = ({
  data,
  navigation,
  handleContinuePress,
  onCrossPress,
  isLoading,
  isNewInspectionLoading,
  inspectionID,
  onYesPress,
  onNoPress,
  isDiscardInspectionModalVisible,
  fetchInspectionInProgress,
  onNewInspectionPress,
}) => (
  <View style={container}>
    {isDiscardInspectionModalVisible && (
      <DiscardInspectionModal
        onYesPress={onYesPress}
        onNoPress={onNoPress}
        description={'Are You Sure Want To Discard Your Inspection?'}
      />
    )}
    <View style={bodyContainer}>
      <View style={styles.bodyHeaderContainer}>
        <Text style={styles.bodyHeaderTitleText}>Inspections in Progress</Text>
      </View>
      <View style={{...bodyHeaderContainer, ...styles.bodyHeaderBorderRadius}}>
        <Text style={{...bodyHeaderTitleText, ...styles.headerHeaderTextTitle}}>
          Please select inspection below to continue. Once you submit, we will
          review and issue certificate
        </Text>
      </View>
      <View style={innerBody}>
        <FlatList
          data={data}
          onRefresh={fetchInspectionInProgress}
          refreshing={isLoading && inspectionID === null}
          renderItem={({item}) => (
            <RenderInspectionInProgress
              item={item}
              styles={styles}
              handleContinuePress={handleContinuePress}
              onCrossPress={onCrossPress}
              isLoading={isLoading || isNewInspectionLoading}
              inspectionID={inspectionID}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyDataContainer}>
              {isLoading ? (
                <Text style={styles.emptyDataText}>Loading...</Text>
              ) : (
                <Text style={styles.emptyDataText}>
                  No Inspection in progress
                </Text>
              )}
            </View>
          }
        />
      </View>
      <PrimaryStartInspectionButton
        isLoading={isNewInspectionLoading}
        buttonPress={onNewInspectionPress}
        textPress={() => handleHomePress(navigation)}
        disabled={isNewInspectionLoading}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  bodyHeaderContainer: {
    width: wp('100%'),
    paddingVertical: '3%',
    paddingLeft: '10%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: '3%',
  },
  bodyHeaderTitleText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  bodyHeaderBorderRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  headerHeaderTextTitle: {
    textAlign: 'center',
  },
  cardContainer: {
    width: wp('90%'),
    backgroundColor: white,
    paddingVertical: '3%',
    marginTop: '5%',
    ...ShadowEffect,
  },
  columnContainer: {
    width: wp('40%'),
    alignItems: 'center',
  },
  tableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: '3%',
  },
  columnTitleText: {
    color: royalBlue,
    fontWeight: '500',
    fontSize: hp('1.9%'),
    paddingBottom: '3%',
  },
  columnDescriptionText: {
    color: black,
    fontSize: hp('1.7%'),
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: hp('2%'),
  },
  button: {
    backgroundColor: royalBlue,
    borderRadius: 5,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('10%'),
  },
  buttonText: {
    color: white,
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
  emptyDataContainer: {
    height: hp('50%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDataText: {
    color: black,
    fontSize: hp('2%'),
  },
  crossIconContainer: {
    position: 'absolute',
    right: wp('2%'),
    top: hp('1%'),
    zIndex: 1,
  },
});

export default InspectionInProgressScreen;
