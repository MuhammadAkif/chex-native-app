import React from 'react';
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

const ScreenHeaderTitle = props => <HeaderTitle {...props} />;
const headerBackground = () => <HeaderBackground />;
const drawerContent = props => <CustomDrawerContent {...props} />;
const NavigatorHeaderTitle = () => <HeaderTitle />;
const headerBackButton = () => <HeaderBackButton />;

const NavigationDrawer = () => {
  const Drawer = createDrawerNavigator();

  const options = {
    headerTitleAlign: 'center',
    headerTitle: ScreenHeaderTitle,
    headerBackground: headerBackground,
  };

  return (
    <Drawer.Navigator
      backBehavior={'history'}
      drawerContent={drawerContent}
      screenOptions={{
        headerTitle: NavigatorHeaderTitle,
        drawerType: 'front',
        drawerStatusBarAnimation: 'slide',
        headerLeft: headerBackButton,
      }}
      initialRouteName={ROUTES.INSPECTION_SELECTION}>
      <Drawer.Screen
        name={ROUTES.INSPECTION_SELECTION}
        component={InspectionSelectionContainer}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ROUTES.INTRO}
        component={IntroContainer}
        options={options}
      />
      <Drawer.Screen
        name={ROUTES.LICENSE_PLATE_SELECTION}
        component={LicensePlateNumberSelectionContainer}
        options={options}
      />
      <Drawer.Screen
        name={ROUTES.NEW_INSPECTION}
        component={NewInspectionContainer}
        options={options}
      />
      <Drawer.Screen
        name={ROUTES.INSPECTION_REVIEWED}
        component={InspectionReviewedContainer}
        options={options}
      />
      <Drawer.Screen
        name={ROUTES.INSPECTION_DETAIL}
        component={InspectionDetailContainer}
        options={options}
      />
      <Drawer.Screen
        name={ROUTES.INSPECTION_IN_PROGRESS}
        component={InspectionInProgressContainer}
        options={options}
      />
    </Drawer.Navigator>
  );
};

export default NavigationDrawer;
