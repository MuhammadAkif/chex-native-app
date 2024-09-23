import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FlatList, StyleSheet, View} from 'react-native';

import {ExpandedCardStyles} from '../../Assets/Styles';
import ItemPickerLabel from './ItemPickerLabel';
import {Image_Type} from '../../Constants';
import ImagePicker_New from './ImagePicker_New';
import {RenderImagePicker} from '../index';

const ItemSeparatorComponent = () => <View style={{width: wp('3%')}} />;

const ImagePickerWithFooterList = ({
  categoryDetails,
  exteriorItems,
  pickerText = 'Capture Image',
  isLoading = false,
  handleMediaModalDetailsPress,
  handleItemPickerPress,
  handleCrossPress,
  isAnnotated = false,
}) => {
  const {title, groupType, key} = categoryDetails;
  return (
    <View style={ExpandedCardStyles.itemPickerOuterContainer}>
      <ItemPickerLabel label={title} />
      <View style={styles.listContainer}>
        <FlatList
          data={Image_Type}
          horizontal={true}
          style={styles.listItemContainer}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListFooterComponent={
            <ImagePicker_New
              text={title}
              pickerText={pickerText}
              imageURL={exteriorItems?.exteriorFront}
              isLoading={isLoading}
              onPress={() => handleItemPickerPress(categoryDetails)}
              onClearPress={() => handleCrossPress(groupType, key)}
              handleMediaModalDetailsPress={() =>
                handleMediaModalDetailsPress(
                  title,
                  exteriorItems?.exteriorFront,
                )
              }
              displayImage={false}
            />
          }
          ListFooterComponentStyle={styles.footerStyle}
          renderItem={({item}) => (
            <RenderImagePicker item={item} isAnnotated={isAnnotated} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {
    width: wp('85%'),
  },
  footerStyle: {
    width: wp('30%'),
  },
});
export default ImagePickerWithFooterList;
