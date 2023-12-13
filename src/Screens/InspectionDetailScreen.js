import React from 'react';
import {View, StyleSheet, FlatList, Platform} from 'react-native';

import {NewInspectionStyles} from '../Assets/Styles';
import {
  AndroidMediaViewModal,
  DisplayMediaModal,
  RenderInspectionDetail,
  RenderInspectionDetailHeader,
} from '../Components';

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
      <View style={styles.bodyContainer}>
        <FlatList
          data={detailsFiles}
          numColumns={2}
          ListHeaderComponent={() => (
            <RenderInspectionDetailHeader
              finalStatus={finalStatus}
              remarks={remarks}
            />
          )}
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
});
export default InspectionDetailScreen;
