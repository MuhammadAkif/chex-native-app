import React, {useMemo} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {ROUTES} from './ROUTES';
import {
  IntroContainer,
  NewInspectionContainer,
  InspectionReviewedContainer,
  InspectionDetailContainer,
  LicensePlateNumberSelectionContainer,
  InspectionInProgressContainer,
  InspectionSelectionContainer,
} from '../Container';
import {
  HeaderBackButton,
  HeaderTitle,
  HeaderBackground,
  CustomDrawerContent,
} from '../Components';

const Drawer = createDrawerNavigator();

const SCREEN_OPTIONS = {
  headerTitle: () => <HeaderTitle />,
  drawerType: 'front',
  drawerStatusBarAnimation: 'slide',
  headerLeft: () => <HeaderBackButton />,
  swipeEdgeWidth: 150,
  headerTitleAlign: 'center',
  headerBackground: () => <HeaderBackground />,
};

const DRAWER_SCREENS = [
  {
    name: ROUTES.INSPECTION_SELECTION,
    component: InspectionSelectionContainer,
    options: {
      headerShown: false,
    },
  },
  {
    name: ROUTES.INTRO,
    component: IntroContainer,
  },
  {
    name: ROUTES.LICENSE_PLATE_SELECTION,
    component: LicensePlateNumberSelectionContainer,
  },
  {
    name: ROUTES.NEW_INSPECTION,
    component: NewInspectionContainer,
  },
  {
    name: ROUTES.INSPECTION_REVIEWED,
    component: InspectionReviewedContainer,
  },
  {
    name: ROUTES.INSPECTION_DETAIL,
    component: InspectionDetailContainer,
  },
  {
    name: ROUTES.INSPECTION_IN_PROGRESS,
    component: InspectionInProgressContainer,
  },
];

const NavigationDrawer = () => {
  const drawerContent = useMemo(
    () => props => <CustomDrawerContent {...props} />,
    [],
  );

  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={drawerContent}
      screenOptions={SCREEN_OPTIONS}
      initialRouteName={ROUTES.INSPECTION_SELECTION}>
      {DRAWER_SCREENS.map(({name, component, options = {}}) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={{...SCREEN_OPTIONS, ...options}}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default NavigationDrawer;
