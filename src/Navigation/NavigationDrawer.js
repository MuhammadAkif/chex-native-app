import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';

import {CustomDrawerContent, HeaderBackButton, HeaderBackground, HeaderTitle} from '../Components';
import {
  DVIRInspectionChecklistContainer,
  DVIRVehicleInfoContainer,
  InspectionDetailContainer,
  InspectionInProgressContainer,
  InspectionReviewedContainer,
  InspectionSelectionContainer,
  IntroContainer,
  LicensePlateNumberSelectionContainer,
  NewInspectionContainer,
} from '../Container';
import {ROUTES} from './ROUTES';

const ScreenHeaderTitle = props => <HeaderTitle {...props} />;
const headerBackground = () => <HeaderBackground />;
const drawerContent = props => <CustomDrawerContent {...props} />;
const NavigatorHeaderTitle = () => <HeaderTitle />;
const headerBackButton = () => <HeaderBackButton />;

const screenOptions = {
  headerTitle: NavigatorHeaderTitle,
  drawerType: 'front',
  drawerStatusBarAnimation: 'slide',
  headerLeft: headerBackButton,
  swipeEdgeWidth: 150,
  unmountOnBlur: true,
};

const {Screen, Navigator} = createDrawerNavigator();

const NavigationDrawer = ({navigation}) => {
  const {
    INSPECTION_SELECTION,
    INTRO,
    LICENSE_PLATE_SELECTION,
    NEW_INSPECTION,
    INSPECTION_REVIEWED,
    INSPECTION_DETAIL,
    INSPECTION_IN_PROGRESS,
    DVIR_INSPECTION_CHECKLIST,
    DVIR_VEHICLE_INFO,
  } = ROUTES;

  const options = {
    headerTitleAlign: 'center',
    headerTitle: ScreenHeaderTitle,
    headerBackground: headerBackground,
  };

  return (
    <Navigator backBehavior={'history'} drawerContent={drawerContent} screenOptions={screenOptions} initialRouteName={INSPECTION_SELECTION}>
      <Screen
        name={INSPECTION_SELECTION}
        component={InspectionSelectionContainer}
        options={{
          headerShown: false,
        }}
      />
      <Screen name={INTRO} component={IntroContainer} options={options} />
      <Screen name={LICENSE_PLATE_SELECTION} component={LicensePlateNumberSelectionContainer} options={options} />
      <Screen name={NEW_INSPECTION} component={NewInspectionContainer} options={options} />
      <Screen name={INSPECTION_REVIEWED} component={InspectionReviewedContainer} options={options} />
      <Screen name={INSPECTION_DETAIL} component={InspectionDetailContainer} options={options} />
      <Screen name={INSPECTION_IN_PROGRESS} component={InspectionInProgressContainer} options={options} />
      {/* DVIR */}
      <Screen name={DVIR_INSPECTION_CHECKLIST} component={DVIRInspectionChecklistContainer} options={options} />
      <Screen name={DVIR_VEHICLE_INFO} component={DVIRVehicleInfoContainer} options={options} />
    </Navigator>
  );
};

export default NavigationDrawer;
