import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  Text,
  ScrollView,
} from 'react-native';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  AndroidMediaViewModal,
  DisplayMediaModal,
  RenderInspectionDetail,
  RenderInspectionDetailHeader,
} from '../Components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CrossFilled, Tick} from '../Assets/Icons';

const InspectionDetailScreen = ({
  detailsFiles,
  finalStatus,
  remarks,
  modalDetails,
  isModalVisible,
  handleDisplayMedia,
  handleDisplayMediaCrossPress,
}) => (
  <View style={NewInspectionStyles.container}>
    {Platform.OS === 'ios' && isModalVisible && (
      <DisplayMediaModal
        handleVisible={handleDisplayMediaCrossPress}
        title={modalDetails?.title}
        isVideo={modalDetails?.isVideo}
        source={modalDetails?.source}
      />
    )}
    {Platform.OS === 'android' && isModalVisible && (
      <AndroidMediaViewModal
        handleVisible={handleDisplayMediaCrossPress}
        title={modalDetails?.title}
        isVideo={modalDetails?.isVideo}
        source={modalDetails?.source}
      />
    )}
    <View
      style={[NewInspectionStyles.bodyContainer, {paddingHorizontal: '5%'}]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.textColor]}>
          Inspection Details
        </Text>
        <View style={styles.finalStatusContainer}>
          <Text style={[styles.text, styles.textColor, {width: wp('30%')}]}>
            Final Status
          </Text>
          {finalStatus && finalStatus.toLowerCase() === 'pass' ? (
            <Tick height={hp('3%')} width={wp('8%')} color={colors.deepGreen} />
          ) : (
            <CrossFilled
              height={hp('3%')}
              width={wp('8%')}
              color={colors.red}
            />
          )}
          <Text style={[styles.text, styles.statusText, styles.textColor]}>
            {finalStatus && finalStatus.toLowerCase() === 'pass'
              ? 'No Damage Detected'
              : 'Damage Detected'}
          </Text>
        </View>
        <View style={styles.statusDescriptionContainer}>
          <ScrollView>
            <Text style={[styles.text, styles.textColor]}>
              {remarks || 'No Remarks'}
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <FlatList
          data={detailsFiles}
          numColumns={2}
          // ListHeaderComponent={() =>
          //   Platform.OS === 'android' && (
          //     <RenderInspectionDetailHeader
          //       finalStatus={finalStatus}
          //       remarks={remarks}
          //     />
          //   )
          // }
          renderItem={({item}) => (
            <RenderInspectionDetail
              item={item}
              handleDisplayMedia={handleDisplayMedia}
            />
          )}
          keyExtractor={item => item?.id}
        />
      </View>
    </View>
  </View>
);
const styles = StyleSheet.create({
  bodyContainer: {
    flex: 2,
  },
  headerContainer: {
    height: hp('30%'),
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    // paddingBottom: 20,
  },
  finalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: colors.silverGray,
  },
  statusDescriptionContainer: {
    height: hp('12%'),
    width: '100%',
    padding: '3%',
    borderRadius: 10,
    backgroundColor: colors.lightGray,
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
  textColor: {color: colors.black},
});
export default InspectionDetailScreen;
