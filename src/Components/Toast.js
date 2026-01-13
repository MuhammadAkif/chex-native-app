import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { XMark, Check, Cross, Exclamation } from '../Assets/Icons';
import { colors } from '../Assets/Styles';
import { hideToast } from '../Store/Actions';
import { Platforms } from '../Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

const { OS } = Platform;
const { ANDROID, IOS } = Platforms;
const { red, gray, white, black, brightGreen } = colors;
const Toast_Icons = {
  error: Cross,
  warning: Exclamation,
  success: Check,
};
const Background_Color = {
  error: red,
  warning: red,
  success: brightGreen,
};

const Toast = props => {
  const { t } = useTranslation();
  const { isModal = false } = props;
  const {
    toast: { visible, message, type },
  } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let timeoutID = setTimeout(() => visible && onCrossPress(), 5000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }
  function onCrossPress() {
    dispatch(hideToast());
  }
  const ICON_COMPONENT = Toast_Icons[type];
  const BACKGROUND_COLOR = Background_Color[type];
  const containerStyle = {
    ...styles.centeredView,
    top: isModal && OS === ANDROID ? StatusBar.currentHeight : insets?.top,
    marginTop: isModal && OS === IOS ? StatusBar.currentHeight : null,
  };
  return (
    <View style={containerStyle}>
      <View style={styles.messageTextContainer}>
        <View style={{ ...styles.iconContainer, backgroundColor: BACKGROUND_COLOR }}>
          <ICON_COMPONENT height={hp('3%')} width={wp('5%')} color={white} />
        </View>
        <Text style={styles.messageText}>{message || t('common.message')}</Text>
        <TouchableOpacity style={{ ...styles.iconContainer, ...styles.crossIconContainer }} onPress={onCrossPress}>
          <XMark height={hp('3%')} width={wp('5%')} color={gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 100,
  },
  centeredView: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
    right: wp('10%'),
  },
  tickContainer: {
    height: '4%',
    backgroundColor: 'red',
    width: '10%',
  },
  messageTextContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    backgroundColor: white,
    justifyContent: 'space-between',
  },
  messageText: {
    paddingVertical: 8,
    paddingLeft: hp('1%'),
    width: wp('60%'),
    color: black,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brightGreen,
    paddingHorizontal: wp('2%'),
  },
  crossIconContainer: {
    backgroundColor: 'transparent',
  },
});

export default Toast;