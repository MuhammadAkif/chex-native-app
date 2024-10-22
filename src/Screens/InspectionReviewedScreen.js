import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  circleBorderRadius,
  colors,
  NewInspectionStyles,
} from '../Assets/Styles';
import {
  PrimaryStartInspectionButton,
  RenderInspectionReviewed,
} from '../Components';
import {handleHomePress} from '../Utils';
import {Filter} from '../Assets/Icons';
import Filter_RBSheet from '../Components/Filter_RBSheet';
import EmptyComponent from '../Components/EmptyComponent';

const {black, royalBlue, gray, white, orange} = colors;

const InspectionReviewedScreen = ({
  handleIsExpanded,
  isExpanded,
  navigation,
  data,
  inspectionDetailsPress,
  isLoading,
  isNewInspectionLoading,
  fetchInspectionInProgress,
  selectedInspectionID,
  onNewInspectionPress,
  onFilterPress,
  filter,
  setInspections,
  setFilter,
  inspections,
}) => (
  <View style={NewInspectionStyles.container}>
    <View style={NewInspectionStyles.bodyContainer}>
      <View style={styles.bodyHeaderContainer}>
        <Text style={styles.bodyHeaderTitleText}>Inspection Reviewed</Text>
        {/*<TouchableOpacity*/}
        {/*  style={styles.filterContainer}*/}
        {/*  onPress={onFilterPress}>*/}
        {/*  <Filter height={hp('2%')} width={wp('5%')} />*/}
        {/*  <Text style={{...styles.homeText, ...styles.filterText}}>Filter</Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
      <View style={NewInspectionStyles.innerBody}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <RenderInspectionReviewed
              item={item}
              isExpanded={isExpanded}
              handleIsExpanded={handleIsExpanded}
              inspectionDetailsPress={inspectionDetailsPress}
              isLoading={isLoading || isNewInspectionLoading}
              selectedInspectionID={selectedInspectionID}
            />
          )}
          onRefresh={() => {
            if (selectedInspectionID === null) {
              fetchInspectionInProgress();
            } else {
              return true;
            }
          }}
          refreshing={isLoading && selectedInspectionID === null}
          keyExtractor={item => item?.id}
          ListEmptyComponent={EmptyComponent}
        />
      </View>
      <PrimaryStartInspectionButton
        buttonPress={onNewInspectionPress}
        textPress={() => handleHomePress(navigation)}
        isLoading={isNewInspectionLoading}
        disabled={isNewInspectionLoading}
      />
    </View>
    {/*<Filter_RBSheet*/}
    {/*  filter={filter}*/}
    {/*  setFilter={setFilter}*/}
    {/*  inspections={inspections}*/}
    {/*  setInspections={setInspections}*/}
    {/*  navigation={navigation}*/}
    {/*/>*/}
  </View>
);

const styles = StyleSheet.create({
  bodyHeaderContainer: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '3%',
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: '3%',
  },
  bodyHeaderTitleText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footer: {
    paddingBottom: '10%',
    width: wp('100%'),
    alignItems: 'center',
  },
  footerText: {
    fontSize: hp('1.9%'),
    color: royalBlue,
  },
  homeText: {
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: orange,
    columnGap: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: circleBorderRadius,
  },
  filterText: {
    color: white,
  },
  noDataText: {
    fontSize: hp('2%'),
    color: gray,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default InspectionReviewedScreen;
