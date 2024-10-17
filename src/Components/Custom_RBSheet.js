import React, {forwardRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const custom_Styles = {
  wrapper: {
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    backgroundColor: '#000',
  },
};
const custom_ModalProps = {
  animationType: 'slide',
  statusBarTranslucent: true,
};
const custom_AvoidingViewProps = {
  enabled: false,
};

const Custom_RBSheet = (props, ref) => {
  const {
    customStyles = custom_Styles,
    useNativeDriver = true,
    height = hp('30%'),
    customModalProps = custom_ModalProps,
    customAvoidingViewProps = custom_AvoidingViewProps,
    children,
  } = props;

  return (
    <RBSheet
      ref={ref}
      height={height}
      useNativeDriver={useNativeDriver}
      customStyles={{...custom_Styles, ...customStyles}}
      customModalProps={{...custom_ModalProps, ...customModalProps}}
      customAvoidingViewProps={{
        ...custom_AvoidingViewProps,
        ...customAvoidingViewProps,
      }}>
      {children}
    </RBSheet>
  );
};

export default forwardRef(Custom_RBSheet);
