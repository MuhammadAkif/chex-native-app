import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { DiscardInspectionModal, LogoHeader, PrimaryStartInspectionButton, RenderInspectionInProgress } from '../Components';
import { colors, NewInspectionStyles, ShadowEffect } from '../Assets/Styles';
import { ROUTES } from '../Navigation/ROUTES';
import { handleHomePress } from '../Utils';

const { black, white, royalBlue } = colors;
const { container, bodyContainer, bodyHeaderContainer, bodyHeaderTitleText, innerBody } = NewInspectionStyles;

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
}) => {
  const { t } = useTranslation();
console.log('data', data);
  return (
    <View style={container}>
      {isDiscardInspectionModalVisible && (
        <DiscardInspectionModal onYesPress={onYesPress} onNoPress={onNoPress} description={t('inspectionInProgress.discardConfirmation')} />
      )}
      <LogoHeader showRight={false} />
      <View style={bodyContainer}>
        <View style={styles.bodyHeaderContainer}>
          <Text style={styles.bodyHeaderTitleText}>{t('inspectionInProgress.title')}</Text>
        </View>
        <View style={{ ...bodyHeaderContainer, ...styles.bodyHeaderBorderRadius }}>
          <Text style={{ ...bodyHeaderTitleText, ...styles.headerHeaderTextTitle }}>
            {t('inspectionInProgress.subtitle')}
          </Text>
        </View>
        <View style={innerBody}>
          <FlatList
            data={data}
            onRefresh={fetchInspectionInProgress}
            refreshing={isLoading && inspectionID === null}
            renderItem={({ item }) => (
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
                {isLoading ? <Text style={styles.emptyDataText}>{t('common.loading')}</Text> : <Text style={styles.emptyDataText}>{t('inspectionInProgress.noInspection')}</Text>}
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
};

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
