import React from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  InspectionStatusCollapsedCard,
  InspectionStatusExpandedCard,
  PrimaryStartInspectionButton,
  RenderInspectionReviewed,
} from '../Components';
import {handleHomePress, handleStartInspectionPress} from '../Utils';

const InspectionReviewedScreen = ({
  handleIsExpanded,
  isExpanded,
  navigation,
  data,
}) => (
  <View style={NewInspectionStyles.container}>
    <View style={NewInspectionStyles.bodyContainer}>
      <View style={styles.bodyHeaderContainer}>
        <Text style={styles.bodyHeaderTitleText}>Inspection Reviewed</Text>
      </View>
      <View style={NewInspectionStyles.innerBody}>
        {/*<View style={NewInspectionStyles.scrollViewContainer}>*/}
        <FlatList
          data={data}
          renderItem={({item}) => (
            <RenderInspectionReviewed
              item={item}
              isExpanded={isExpanded}
              handleIsExpanded={handleIsExpanded}
            />
          )}
          keyExtractor={item => item?.id}
        />
      </View>
      <PrimaryStartInspectionButton
        buttonPress={() => handleStartInspectionPress(navigation)}
        textPress={() => handleHomePress(navigation)}
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
    color: colors.royalBlue,
  },
  homeText: {
    fontWeight: 'bold',
  },
});

export default InspectionReviewedScreen;
