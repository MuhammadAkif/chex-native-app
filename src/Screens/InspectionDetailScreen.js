import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {NewInspectionStyles} from '../Assets/Styles';
import {MockInspectionDetail} from '../Utils';
import {
  RenderInspectionDetail,
  RenderInspectionDetailHeader,
} from '../Components';

const InspectionDetailScreen = () => (
  <View style={NewInspectionStyles.container}>
    <View
      style={[NewInspectionStyles.bodyContainer, {paddingHorizontal: '5%'}]}>
      <View style={styles.bodyContainer}>
        <FlatList
          data={MockInspectionDetail}
          numColumns={2}
          ListHeaderComponent={() => <RenderInspectionDetailHeader />}
          renderItem={({item}) => <RenderInspectionDetail item={item} />}
          keyExtractor={item => item?.name}
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
