import React from 'react';
import {HeaderBackButton, HeaderBackground, HeaderTitle} from '../Components';

export const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
};

export const drawerScreenOptions = {
  headerTitle: () => <HeaderTitle />,
  headerTitleAlign: 'center',
  headerBackground: () => <HeaderBackground />,
  headerLeft: () => <HeaderBackButton />,
  drawerType: 'front',
  drawerStatusBarAnimation: 'slide',
  swipeEdgeWidth: 150,
  unmountOnBlur: true,
};

export const headerOptions = {
  headerTitle: props => <HeaderTitle {...props} />,
  headerTitleAlign: 'center',
  headerBackground: () => <HeaderBackground />,
};
