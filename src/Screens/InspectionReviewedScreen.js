import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import {buttonTextStyle, colors, NewInspectionStyles} from '../Assets/Styles';
import {
  InspectionStatusCollapsedCard,
  InspectionStatusExpandedCard,
} from '../Components';
import {Plus} from '../Assets/Icons';

const InspectionReviewedScreen = ({handleIsExpanded, isExpanded}) => (
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
      <View style={styles.footer}>
        <TouchableOpacity>
          <LinearGradient
            colors={['#FF7A00', '#F90']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.buttonContainer]}>
            <Plus height={hp('5%')} width={wp('5%')} color={colors.white} />
            <Text style={[buttonTextStyle, {right: wp('8%')}]}>
              Start Inspection
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Or Go back to
          <Text style={styles.homeText}> Home</Text> page
        </Text>
      </View>
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
