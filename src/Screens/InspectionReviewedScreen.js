import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  PrimaryStartInspectionButton,
  RenderInspectionReviewed,
} from '../Components';
import {handleHomePress} from '../Utils';

const {black, royalBlue} = colors;

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
}) => (
  <View style={NewInspectionStyles.container}>
    <View style={NewInspectionStyles.bodyContainer}>
      <View style={styles.bodyHeaderContainer}>
        <Text style={styles.bodyHeaderTitleText}>Inspection Reviewed</Text>
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
        />
      </View>
      <PrimaryStartInspectionButton
        buttonPress={onNewInspectionPress}
        textPress={() => handleHomePress(navigation)}
        isLoading={isNewInspectionLoading}
        disabled={isNewInspectionLoading}
      />
    </View>
  </View>
);

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
});

export default InspectionReviewedScreen;
