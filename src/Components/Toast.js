import React, {useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {XMark, Check, Cross, Exclamation} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {Platforms} from '../Constants';
import {useUIActions, useUIState} from '../hooks/UI';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;
const {red, gray, white, black, brightGreen} = colors;
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
  const {clearToast} = useUIActions();
  const {isModal = false} = props;
  const {
    toast: {visible, message, type},
  } = useUIState();

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
    clearToast();
  }
  const ICON_COMPONENT = Toast_Icons[type];
  const BACKGROUND_COLOR = Background_Color[type];
  const containerStyle = {
    ...styles.centeredView,
    top: isModal && OS === ANDROID ? hp('0.7%') : hp('5%'),
    marginTop: isModal && OS === IOS ? StatusBar.currentHeight : null,
  };
  return (
    <View style={containerStyle}>
      <View style={styles.messageTextContainer}>
        <View
          style={{...styles.iconContainer, backgroundColor: BACKGROUND_COLOR}}>
          <ICON_COMPONENT height={hp('3%')} width={wp('5%')} color={white} />
        </View>
        <Text style={styles.messageText}>{message || 'Message'}</Text>
        <TouchableOpacity
          style={{...styles.iconContainer, ...styles.crossIconContainer}}
          onPress={onCrossPress}>
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

/*import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {XMark, Check, Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {fallBack} from '../Utils';

const {red, gray, white, black, brightGreen} = colors;
const Toast_Icons = {
  true: Cross,
  false: Check,
};
const Background_Color = {
  true: red,
  false: brightGreen,
};
const Container_Top = {
  true: hp('5%'),
  false: null,
};

const Toast = ({
  message,
  onCrossPress,
  isError = false,
  isForgetPassword = false,
  icon = Toast_Icons[isError],
  iconContainerStyle = {},
  isVisible = false,
}) => {
  const [visible, setVisible] = useState(isVisible);
  console.log({visible, isVisible, isForgetPassword});
  useEffect(() => {
    let timeoutID = setTimeout(() => {
      visible && setVisible(false);
      isVisible && onCrossPress();
    }, 5000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [isVisible, visible]);
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);
  if (!visible) {
    return;
  }
  const ICON_COMPONENT = icon;
  const BACKGROUND_COLOR = Background_Color[isError];
  console.log(
    'Container_Top[isForgetPassword] ',
    Container_Top[isForgetPassword],
  );
  return (
    <View style={[styles.centeredView, {top: Container_Top[isForgetPassword]}]}>
      <View style={styles.messageTextContainer}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: BACKGROUND_COLOR},
            iconContainerStyle,
          ]}>
          <ICON_COMPONENT height={hp('3%')} width={wp('5%')} color={white} />
        </View>
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity
          style={[styles.iconContainer, {backgroundColor: 'transparent'}]}
          onPress={onCrossPress}>
          <XMark height={hp('3%')} width={wp('5%')} color={gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Toast;
*/
