import React from 'react';
import {View, TouchableOpacity, StyleSheet, StatusBar, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SignInLogo from './SignInLogo';
import {PROJECT_NAME} from '../Constants';
import {BackArrow} from '../Assets/Icons';
import {colors} from '../Assets/Styles';

const HEADER_HEIGHT = 50; // consistent height for all cases

const LogoHeader = ({showLeft = true, leftIcon, rightIcon, onLeftPress, onRightPress}) => {
  const navigation = useNavigation();

  const renderLeft = () => {
    if (!showLeft) return null;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onLeftPress || navigation?.goBack}>
        {leftIcon ? leftIcon : <BackArrow width={24} height={24} color={colors.white} />}
      </TouchableOpacity>
    );
  };

  const renderRight = () => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onRightPress}>
        {rightIcon ? rightIcon : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={Platform.OS === 'ios' ? ['top', 'left', 'right'] : ['left', 'right']}
      style={[styles.safeArea, Platform.OS === 'android' && {paddingTop: StatusBar.currentHeight}]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.headerRow}>
        {/* Left slot */}
        <View style={styles.leftSide}>{renderLeft()}</View>

        {/* Center logo */}
        <View style={styles.center}>
          <SignInLogo
            titleText={PROJECT_NAME.CHEX}
            dotTitleText={PROJECT_NAME.AI}
            textStyle={styles.logo}
            nestedTextStyle={styles.logo}
            containerStyle={styles.logoContainer}
          />
        </View>

        {/* Right slot */}
        <View style={styles.rightSide}>{renderRight()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    // backgroundColor: '#1E7DCB',
  },
  headerRow: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  leftSide: {
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSide: {
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: wp(6.5),
  },
  logoContainer: {
    height: undefined,
    width: undefined,
  },
});

export default LogoHeader;
