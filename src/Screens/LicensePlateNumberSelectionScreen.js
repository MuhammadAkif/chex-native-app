import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  DiscardInspectionModal,
  PrimaryGradientButton,
  RenderLicensePlateNumber,
  NumberPlateInUseModal,
} from '../Components';

const LicensePlateNumberSelectionScreen = ({
  handleSelectedNP,
  selectedNP,
  data,
  search,
  handleSearchInput,
  handleSubmit,
  selectText,
  isLoading,
  errorTitle,
  isDiscardInspectionModalVisible,
  onNoPress,
  onYesPress,
  handleOkPress,
  numberPlateInUseError,
}) => (
  <View style={NewInspectionStyles.container}>
    {isDiscardInspectionModalVisible && (
      <DiscardInspectionModal
        onNoPress={onNoPress}
        onYesPress={onYesPress}
        description={errorTitle}
        noButtonText={{color: colors.black}}
        noButtonStyle={{borderColor: colors.orange}}
      />
    )}
    {numberPlateInUseError && (
      <NumberPlateInUseModal onOkPress={handleOkPress} />
    )}
    <TouchableOpacity
      style={[NewInspectionStyles.bodyContainer, styles.container]}
      activeOpacity={1}
      onPress={Keyboard.dismiss}>
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
          keyboardShouldPersistTaps={'handled'}
        />
      </View>
      <View style={styles.footerContainer}>
        <PrimaryGradientButton
          text={selectText}
          onPress={handleSubmit}
          disabled={selectedNP === null || isLoading}
        />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: wp('100%'),
  },
  headerContainer: {
    flex: Platform.OS === 'ios' ? 0.3 : null,
  },
  bodyHeader: {
    fontSize: hp('2%'),
    width: wp('90%'),
    paddingVertical: 15,
    color: colors.black,
  },
  searchInput: {
    height: hp('5%'),
    width: wp('90%'),
    fontSize: hp('1.8%'),
    padding: '3%',
    color: colors.black,
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
