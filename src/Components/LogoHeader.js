import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {BellWhiteIcon, HamburgerIcon} from '../Assets/Icons';
import SignInLogo from './SignInLogo';
import {PROJECT_NAME} from '../Constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const LogoHeader = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={styles.headerContentContainer}>
        <IconWrapper onPress={navigation?.openDrawer}>
          <HamburgerIcon />
        </IconWrapper>

        <SignInLogo
          titleText={PROJECT_NAME.CHEX}
          dotTitleText={PROJECT_NAME.AI}
          textStyle={styles.logo}
          nestedTextStyle={styles.logo}
          containerStyle={styles.logoContainer}
        />

        <IconWrapper>
          <BellWhiteIcon />
        </IconWrapper>
      </View>
    </SafeAreaView>
  );
};

const IconWrapper = ({children, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.iconWrapperContainer} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerContentContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  logo: {fontSize: wp(6.5)},
  logoContainer: {height: undefined, width: undefined, alignItems: undefined, justifyContent: undefined},
  iconWrapperContainer: {
    backgroundColor: '#1E7DCB',
    width: 45,
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LogoHeader;
