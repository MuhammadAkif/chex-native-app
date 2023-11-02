import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, NewInspectionStyles} from '../Assets/Styles';
import {
  InspectionStatusCollapsedCard,
  InspectionStatusExpandedCard,
  PrimaryStartInspectionButton,
} from '../Components';
import {handleHomePress, handleStartInspectionPress} from '../Utils';

const InspectionReviewedScreen = ({
  handleIsExpanded,
  isExpanded,
  navigation,
}) => (
  <View style={NewInspectionStyles.container}>
    <View style={NewInspectionStyles.bodyContainer}>
      <View style={styles.bodyHeaderContainer}>
        <Text style={styles.bodyHeaderTitleText}>Inspection Reviewed</Text>
      </View>
      <View style={NewInspectionStyles.innerBody}>
        <ScrollView
          contentContainerStyle={NewInspectionStyles.scrollViewContainer}
          showsVerticalScrollIndicator={false}>
          <InspectionStatusCollapsedCard
            textOne={'21-0001'}
            textTwo={'12/02/2021'}
            index={1}
            isReviewed={'In Review'}
            labelOne={'Tracking ID'}
            labelTwo={'Date Created'}
            onPress={handleIsExpanded}
          />
          <InspectionStatusCollapsedCard
            textOne={'21-0002'}
            textTwo={'12/02/2022'}
            index={1}
            isReviewed={'Reviewed'}
            labelOne={'Tracking ID'}
            labelTwo={'Date Completed'}
            isActive={isExpanded}
            onPress={handleIsExpanded}
          />
          {isExpanded && <InspectionStatusExpandedCard />}
        </ScrollView>
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
