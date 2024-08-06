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
  const {
    INSPECTION_SELECTION,
    INTRO,
    LICENSE_PLATE_SELECTION,
    NEW_INSPECTION,
    INSPECTION_REVIEWED,
    INSPECTION_DETAIL,
    INSPECTION_IN_PROGRESS,
  } = ROUTES;
  const options = {
    headerTitleAlign: 'center',
    headerTitle: ScreenHeaderTitle,
    headerBackground: headerBackground,
  };
  const screenOptions = {
    headerTitle: NavigatorHeaderTitle,
    drawerType: 'front',
    drawerStatusBarAnimation: 'slide',
    headerLeft: headerBackButton,
    swipeEdgeWidth: 200,
  };

  return (
    <Drawer.Navigator
      backBehavior={'history'}
      drawerContent={drawerContent}
      screenOptions={screenOptions}
      initialRouteName={INSPECTION_SELECTION}>
      <Drawer.Screen
        name={INSPECTION_SELECTION}
        component={InspectionSelectionContainer}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={INTRO}
        component={IntroContainer}
        options={options}
      />
      <Drawer.Screen
        name={LICENSE_PLATE_SELECTION}
        component={LicensePlateNumberSelectionContainer}
        options={options}
      />
      <Drawer.Screen
        name={NEW_INSPECTION}
        component={NewInspectionContainer}
        options={options}
      />
      <Drawer.Screen
        name={INSPECTION_REVIEWED}
        component={InspectionReviewedContainer}
        options={options}
      />
      <Drawer.Screen
        name={INSPECTION_DETAIL}
        component={InspectionDetailContainer}
        options={options}
      />
      <Drawer.Screen
        name={INSPECTION_IN_PROGRESS}
        component={InspectionInProgressContainer}
        options={options}
      />
    </Drawer.Navigator>
  );
};

export default NavigationDrawer;
