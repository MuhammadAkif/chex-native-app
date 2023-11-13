import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {NewInspectionStyles} from '../Assets/Styles';
import {
  RenderInspectionDetail,
  RenderInspectionDetailHeader,
} from '../Components';

const InspectionDetailScreen = ({detailsFiles}) => (
  <View style={NewInspectionStyles.container}>
    <View
      style={[NewInspectionStyles.bodyContainer, {paddingHorizontal: '5%'}]}>
      <View style={styles.bodyContainer}>
        <FlatList
          data={detailsFiles}
          numColumns={2}
          ListHeaderComponent={() => <RenderInspectionDetailHeader />}
          renderItem={({item}) => <RenderInspectionDetail item={item} />}
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
