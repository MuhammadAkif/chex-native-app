import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { CompletedInspectionBackgroundImage } from '../Components';
import { colors } from '../Assets/Styles';
import { PrimaryGradientButton } from '../Components';
import { PROJECT_NAME } from '../Constants';

const { white, blueGray } = colors;
const { CHEX_AI } = PROJECT_NAME;

const CompletedInspectionScreen = ({ onHomePress }) => {
  const { t } = useTranslation();

  return (
    <CompletedInspectionBackgroundImage>
      <View style={styles.container}>
        <LinearGradient colors={['transparent', '#001B51']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.7]} style={styles.body}>
          <View style={{ flex: 1 }} />
          <View style={styles.bodyFooterContainer}>
            <Text style={{ ...styles.textColor, ...styles.titleText, textAlign: 'center' }}>{t('completedInspection.thankYou')}</Text>
            <Text style={{ ...styles.textColor, ...styles.subheadingText }}>{CHEX_AI}</Text>
            <Text style={{ ...styles.textColor, ...styles.subTitleText }}>{t('completedInspection.message')}</Text>
            <PrimaryGradientButton buttonStyle={styles.button} text={t('completedInspection.homeButton')} onPress={onHomePress} />
            <View style={styles.bodyFooterEmptyView} />
          </View>
        </LinearGradient>
      </View>
    </CompletedInspectionBackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bodyFooterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textColor: {
    color: white,
  },
  titleText: {
    fontSize: hp('3.5%'),
    fontWeight: '500',
  },
  subheadingText: {
    fontSize: hp('3.5%'),
    fontWeight: '800',
  },
  subTitleText: {
    fontSize: hp('1.7%'),
    width: wp('70%'),
    textAlign: 'center',
    color: blueGray,
  },
  button: {
    borderRadius: 30,
  },
  bodyFooterEmptyView: {
    flex: 0.3,
  },
});

export default CompletedInspectionScreen;
