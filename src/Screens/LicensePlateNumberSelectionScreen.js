import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {PrimaryGradientButton, RenderLicensePlateNumber} from '../Components';

const LicensePlateNumberSelectionScreen = ({
  handleSelectedNP,
  selectedNP,
  data,
  search,
  handleSearchInput,
  handleSubmit,
  selectText,
  isLoading,
}) => (
  <View style={NewInspectionStyles.container}>
    <View style={[NewInspectionStyles.bodyContainer, styles.container]}>
      <View style={styles.headerContainer}>
        <Text style={styles.bodyHeader}>New Inspection</Text>
        <Text style={styles.bodyHeader}>Select Car License Plate Number</Text>
        <TextInput
          value={search}
          onChangeText={handleSearchInput}
          placeholder={'License Plate Number'}
          placeholderTextColor={colors.steelGray}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.innerBodyContainer}>
        <FlatList
          data={data}
          ListEmptyComponent={
            <ActivityIndicator size={'large'} color={colors.royalBlue} />
          }
          renderItem={({item}) => (
            <RenderLicensePlateNumber
              item={item}
              selectedNP={selectedNP}
              handleSelectedNP={handleSelectedNP}
              isLoading={isLoading}
            />
          )}
        />
      </View>
      <View style={styles.footerContainer}>
        <PrimaryGradientButton
          text={selectText}
          onPress={handleSubmit}
          disabled={selectedNP === '' || isLoading}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: wp('100%'),
  },
  headerContainer: {
    flex: 0.3,
  },
  bodyHeader: {
    fontSize: hp('2%'),
    width: wp('90%'),
    paddingVertical: 15,
  },
  searchInput: {
    height: hp('5%'),
    fontSize: hp('1.8%'),
    width: wp('90%'),
    padding: '3%',
    backgroundColor: colors.silverGray,
  },
  innerBodyContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 0.2,
    backgroundColor: 'transparent',
  },
});
export default LicensePlateNumberSelectionScreen;
