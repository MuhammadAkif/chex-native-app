import React, {memo, useCallback} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppText from '../Components/text';
import Home from '../Screens/NewDesign/Home';
import {VehicleInformation} from '../Screens';
import {GradientCircleTabIcon, HomeTabIcon, ProfileTabIcon, ReportTabIcon, TripTabIcon} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {TABS} from './ROUTES';
import {InspectionReviewedContainer} from '../Container';

const Tab = createBottomTabNavigator();

/** Mapping route names to their respective icons */
const ICON_MAP = {
  [TABS.HOME]: HomeTabIcon,
  [TABS.REPORTS]: ReportTabIcon,
  [TABS.MY_TRIPS]: TripTabIcon,
  [TABS.PROFILE]: ProfileTabIcon,
};

const getIconColor = isFocused => (isFocused ? colors.oceanBlue : colors.slateGray);

const BottomTab = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}>
    <Tab.Screen name={TABS.HOME} component={Home} options={{tabBarLabel: 'Home'}} />
    <Tab.Screen name={TABS.REPORTS} component={InspectionReviewedContainer} options={{tabBarLabel: 'Reports'}} />
    <Tab.Screen name={TABS.INSPECTION} component={VehicleInformation} options={{tabBarLabel: 'Inspection'}} />
    <Tab.Screen name={TABS.MY_TRIPS} component={VehicleInformation} options={{tabBarLabel: 'My Trips'}} />
    <Tab.Screen name={TABS.PROFILE} component={VehicleInformation} options={{tabBarLabel: 'Profile'}} />
  </Tab.Navigator>
);

export default BottomTab;

const CustomTabBar = memo(({state, descriptors, navigation}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        /** Special middle button (Inspection) */
        if (route.name === TABS.INSPECTION) {
          const onPress = () => navigation.navigate(route.name);
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.inspectionButtonWrapper}>
              <View style={styles.inspectionButton}>
                <GradientCircleTabIcon />
              </View>
              <AppText style={[styles.inspectionLabel, isFocused && styles.labelFocused]}>{label}</AppText>
            </Pressable>
          );
        }

        const onPress = useCallback(() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }, [isFocused, navigation, route.key, route.name]);

        const IconComponent = ICON_MAP[route.name];

        return (
          <Pressable key={route.key} accessibilityRole="button" onPress={onPress} style={styles.tabItem}>
            {isFocused && <View style={styles.activeIndicator} />}
            {IconComponent && <IconComponent stroke={getIconColor(isFocused)} size={22} />}
            <AppText style={[styles.label, isFocused && styles.labelFocused]}>{label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(9),
    backgroundColor: colors.white,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(0.5),
  },
  label: {
    fontSize: wp(3),
    color: colors.slateGray,
    fontWeight: '500',
    marginTop: 2,
  },
  labelFocused: {
    color: colors.oceanBlue,
    fontWeight: '500',
  },
  inspectionButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -hp(2.5),
  },
  inspectionButton: {
    width: wp(14),
    height: wp(14),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inspectionLabel: {
    top: hp(1),
    color: colors.slateGray,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: -hp(1.9),
    width: '50%',
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.oceanBlue,
  },
});
