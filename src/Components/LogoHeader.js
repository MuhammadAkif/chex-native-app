import React from 'react';
import {View, TouchableOpacity, StyleSheet, StatusBar, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {BellWhiteIcon, HamburgerIcon} from '../Assets/Icons';
import SignInLogo from './SignInLogo';
import {PROJECT_NAME} from '../Constants';
import HeaderBackButton from './HeaderBackButton';

const HEADER_HEIGHT = 45; // consistent height for all cases

const LogoHeader = ({
  showLeft = true,
  showRight = true,
  leftIcon = <HeaderBackButton />,
  rightIcon = <BellWhiteIcon />,
  onLeftPress,
  onRightPress,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      edges={Platform.OS === 'ios' ? ['top', 'left', 'right'] : ['left', 'right']}
      style={[styles.safeArea, Platform.OS === 'android' && {paddingTop: StatusBar.currentHeight}]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.headerRow}>
        {/* Left slot */}
        <View style={styles.side}>{showLeft && <IconWrapper onPress={onLeftPress || navigation?.openDrawer}>{leftIcon}</IconWrapper>}</View>

        {/* Center logo */}

        <SignInLogo
          titleText={PROJECT_NAME.CHEX}
          dotTitleText={PROJECT_NAME.AI}
          textStyle={styles.logo}
          nestedTextStyle={styles.logo}
          containerStyle={styles.logoContainer}
        />

        {/* Right slot */}
        <View style={styles.side}>{showRight && <IconWrapper onPress={onRightPress}>{rightIcon}</IconWrapper>}</View>
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
  safeArea: {
    // backgroundColor: '#1E7DCB',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center', // keeps everything vertically centered
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  side: {
    width: 50, // keeps space reserved
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    fontSize: wp(6.5),
  },
  logoContainer: {
    height: undefined,
    width: undefined,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
