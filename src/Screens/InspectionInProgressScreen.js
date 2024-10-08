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
import Toast from '../Components/Toast';

const {black, white, royalBlue} = colors;

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
  modalMessageDetails,
  handleOkPress,
  onNewInspectionPress,
}) => (
  <View style={NewInspectionStyles.container}>
    {isDiscardInspectionModalVisible && (
      <DiscardInspectionModal
        onYesPress={onYesPress}
        onNoPress={onNoPress}
        description={'Are You Sure Want To Discard Your Inspection?'}
      />
    )}
    {modalMessageDetails.isVisible && (
      <Toast
        onCrossPress={handleOkPress}
        message={modalMessageDetails.message}
      />
    )}
    <View style={NewInspectionStyles.bodyContainer}>
      <View style={styles.bodyHeaderContainer}>
        <Text style={styles.bodyHeaderTitleText}>Inspections in Progress</Text>
      </View>
      <View
        style={[
          NewInspectionStyles.bodyHeaderContainer,
          styles.bodyHeaderBorderRadius,
        ]}>
        <Text
          style={[
            NewInspectionStyles.bodyHeaderTitleText,
            styles.headerHeaderTextTitle,
          ]}>
          Please select inspection below to continue. Once you submit, we will
          review and issue certificate
        </Text>
      </View>
      <View style={NewInspectionStyles.innerBody}>
        {data.length ? (
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
          />
        ) : (
          <View style={styles.emptyDataContainer}>
            {isLoading ? (
              <Text style={styles.emptyDataText}>Loading...</Text>
            ) : (
              <Text style={styles.emptyDataText}>
                No Inspection in progress
              </Text>
            )}
          </View>
        )}
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
    flex: 1,
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
