import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  PrimaryStartInspectionButton,
  RenderInspectionInProgress,
} from '../Components';
import {colors, NewInspectionStyles, ShadowEffect} from '../Assets/Styles';
import { handleHomePress, handleStartInspectionPress } from "../Utils";
import FastImage from 'react-native-fast-image';

const InspectionInProgressScreen = ({
  data,
  navigation,
  handleContinuePress,
  onCrossPress,
}) => (
  <View style={NewInspectionStyles.container}>
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
            renderItem={({item}) => (
              <RenderInspectionInProgress
                item={item}
                styles={styles}
                handleContinuePress={handleContinuePress}
                onCrossPress={onCrossPress}
              />
            )}
          />
        ) : (
          <View style={styles.emptyDataContainer}>
            <Text style={styles.emptyDataText}>No Inspection in progress</Text>
          </View>
        )}
      </View>
      <PrimaryStartInspectionButton
        buttonPress={() => handleStartInspectionPress(navigation)}
        textPress={() => handleHomePress(navigation)}
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
    backgroundColor: colors.white,
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
    color: colors.royalBlue,
    fontWeight: '500',
    fontSize: hp('1.9%'),
    paddingBottom: '3%',
  },
  columnDescriptionText: {
    color: colors.black,
    fontSize: hp('1.7%'),
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: hp('2%'),
  },
  button: {
    backgroundColor: colors.royalBlue,
    borderRadius: 5,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('10%'),
  },
  buttonText: {
    color: colors.white,
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
    color: colors.black,
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