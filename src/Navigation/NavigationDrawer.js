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
  DeviceContainer,
  TripHistoryContainer,
} from '../Container';
import {
  HeaderBackButton,
  HeaderTitle,
  HeaderBackground,
  CustomDrawerContent,
} from '../Components';
import TripDetailContainer from '../Container/TripDetailContainer';

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
};
const NavigationDrawer = ({navigation}) => {
  const {Screen, Navigator} = createDrawerNavigator();
  const {
    INSPECTION_SELECTION,
    INTRO,
    LICENSE_PLATE_SELECTION,
    NEW_INSPECTION,
    INSPECTION_REVIEWED,
    INSPECTION_DETAIL,
    INSPECTION_IN_PROGRESS,
    DEVICE,
    TRIP_HISTORY,
    TRIP_DETAIL,
  } = ROUTES;
  const options = {
    headerTitleAlign: 'center',
    headerTitle: ScreenHeaderTitle,
    headerBackground: headerBackground,
  };

  return (
    <>
      <Navigator
        backBehavior={'history'}
        drawerContent={drawerContent}
        screenOptions={screenOptions}
        initialRouteName={INSPECTION_SELECTION}>
        <Screen
          name={INSPECTION_SELECTION}
          component={InspectionSelectionContainer}
          options={{
            headerShown: false,
          }}
        />
        <Screen name={INTRO} component={IntroContainer} options={options} />
        <Screen
          name={LICENSE_PLATE_SELECTION}
          component={LicensePlateNumberSelectionContainer}
          options={options}
        />
        <Screen
          name={NEW_INSPECTION}
          component={NewInspectionContainer}
          options={options}
        />
        <Screen
          name={INSPECTION_REVIEWED}
          component={InspectionReviewedContainer}
          options={options}
        />
        <Screen
          name={INSPECTION_DETAIL}
          component={InspectionDetailContainer}
          options={options}
        />
        <Screen
          name={INSPECTION_IN_PROGRESS}
          component={InspectionInProgressContainer}
          options={options}
        />
        <Screen name={DEVICE} component={DeviceContainer} options={options} />
        <Screen
          name={TRIP_HISTORY}
          component={TripHistoryContainer}
          options={options}
        />
        <Screen
          name={TRIP_DETAIL}
          component={TripDetailContainer}
          options={options}
        />
      </Navigator>
    </>
  );
};

export default NavigationDrawer;
