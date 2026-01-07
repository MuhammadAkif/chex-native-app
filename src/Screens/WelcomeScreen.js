import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import { BackgroundImageView, PrimaryGradientButton, SignInLogo } from '../Components';
import { colors } from '../Assets/Styles';

const { cobaltBlue } = colors;

const WelcomeScreen = ({ handleSignInPress }) => {
  const { t } = useTranslation();

  return (
    <BackgroundImageView>
      <View style={styles.container}>
        <LinearGradient colors={['#1876CC', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.6]} style={styles.headerGradient}>
          <View style={styles.headerEmptyView} />
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>{t('welcome.title')}</Text>
            <SignInLogo titleText={'CHEX'} dotTitleText={'.AI'} subtitleText={t('welcome.subtitle')} />
          </View>
        </LinearGradient>
        <View style={styles.bodyContainer}>
          <PrimaryGradientButton text={t('common.signIn')} onPress={handleSignInPress} />
        </View>
        <View style={styles.emptyView} />
      </View>
    </BackgroundImageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerGradient: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    width: wp('100%'),
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: hp('2%'),
    color: cobaltBlue,
  },
  bodyContainer: {
    flex: 0.25,
    width: wp('100%'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  emptyView: {
    flex: 0.3,
  },
  headerEmptyView: {
    flex: 0.15,
  },
});
export default WelcomeScreen;
