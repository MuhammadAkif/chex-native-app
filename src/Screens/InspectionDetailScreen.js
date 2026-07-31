import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, FlatList, Platform, Text, ScrollView} from 'react-native';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {AiSummary, AndroidMediaViewModal, DisplayMediaModal, LogoHeader, RenderInspectionDetail} from '../Components';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {INSPECTION_STATUS} from '../Utils/helpers';

const {OS} = Platform;
const {silverGray, lightGray, black} = colors;
const mediaViewModals = {
  ios: DisplayMediaModal,
  android: AndroidMediaViewModal,
};
const ActiveMediaViewModal = mediaViewModals[OS];
const {container, bodyContainer} = NewInspectionStyles;

const InspectionDetailScreen = ({
  detailsFiles,
  finalStatus,
  remarks = 'No Remarks',
  aiSummary,
  modalDetails,
  isModalVisible,
  handleDisplayMedia,
  handleDisplayMediaCrossPress,
  iconColor,
  ICON_COMPONENT,
  isPassed,
}) => {
  const {t} = useTranslation();
  const hasAiSummary = typeof aiSummary === 'string' && aiSummary.trim().length > 0;

  return (
    <View style={container}>
      <LogoHeader />

      {isModalVisible && (
        <ActiveMediaViewModal
          handleVisible={handleDisplayMediaCrossPress}
          title={modalDetails?.title}
          isVideo={modalDetails?.isVideo}
          source={modalDetails?.source}
          coordinates={modalDetails?.coordinates}
        />
      )}
      <View style={{...bodyContainer, paddingHorizontal: '5%'}}>
        <View style={styles.headerContainer}>
          <Text style={{...styles.headerText, ...styles.textColor}}>{t('inspectionDetail.title')}</Text>
          <View style={styles.finalStatusContainer}>
            <Text style={{...styles.text, ...styles.textColor, width: wp('30%')}}>{t('inspectionDetail.finalStatus')}</Text>
            <ICON_COMPONENT height={hp('3%')} width={wp('8%')} color={iconColor} />
            <Text style={{...styles.text, ...styles.statusText, ...styles.textColor}}>{INSPECTION_STATUS[isPassed]}</Text>
          </View>
          {hasAiSummary && (
            <>
              <Text style={{...styles.aiSummaryTitle, ...styles.textColor}}>{t('inspectionDetail.aiSummary')}</Text>
              <View style={styles.aiSummaryContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <AiSummary summary={aiSummary} />
                </ScrollView>
              </View>
            </>
          )}
        </View>
        <View style={styles.bodyContainer}>
          <FlatList
            data={detailsFiles}
            numColumns={2}
            renderItem={({item}) => <RenderInspectionDetail item={item} handleDisplayMedia={handleDisplayMedia} />}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bodyContainer: {
    flex: 2,
  },
  headerContainer: {
    justifyContent: 'space-evenly',
    paddingBottom: hp('2%'),
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
  },
  finalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: silverGray,
  },
  statusDescriptionContainer: {
    height: hp('12%'),
    width: '100%',
    padding: '3%',
    borderRadius: 10,
    backgroundColor: lightGray,
  },
  aiSummaryTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginTop: hp('1.5%'),
    marginBottom: hp('1%'),
    paddingHorizontal: '2%',
  },
  aiSummaryContainer: {
    height: hp('18%'),
    width: '100%',
    padding: '3%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECEC',
    backgroundColor: lightGray,
  },
  headerText: {
    paddingHorizontal: '2%',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  text: {
    fontSize: hp('1.8%'),
    // textTransform: 'capitalize',
  },
  statusText: {
    fontWeight: 'bold',
    marginLeft: '2%',
  },
  textColor: {color: black},
});
export default InspectionDetailScreen;
