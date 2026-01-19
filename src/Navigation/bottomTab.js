import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppText from '../Components/text';
import { GradientCircleTabIcon, HomeTabIcon, ProfileTabIcon, ReportTabIcon, TripTabIcon } from '../Assets/Icons';
import { colors } from '../Assets/Styles';
import { TABS } from './ROUTES';
import { HomeTabStack, InspectionTabStack, MyTripsTabStack, ProfileTabStack, ReportTabStack } from './stacks';

const Tab = createBottomTabNavigator();

/** Mapping route names to their respective icons */
const ICON_MAP = {
  [TABS.HOME]: HomeTabIcon,
  [TABS.REPORTS]: ReportTabIcon,
  [TABS.MY_TRIPS]: TripTabIcon,
  [TABS.PROFILE]: ProfileTabIcon,
};

const getIconColor = isFocused => (isFocused ? colors.oceanBlue : colors.slateGray);

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        // Handle Press
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // --- 1. RENDER MIDDLE FLOATING BUTTON (INSPECTION) ---
        if (route.name === TABS.INSPECTION) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.inspectionWrapper}
              // accessibility properties for screen readers
              accessibilityRole="button"
              accessibilityLabel={String(label)}>
              <View style={styles.inspectionButton}>
                <GradientCircleTabIcon />
              </View>
              <AppText numberOfLines={1} style={[styles.inspectionLabel, isFocused && styles.labelFocused]}>
                {label}
              </AppText>
            </Pressable>
          );
        }

        // --- 2. RENDER STANDARD TABS ---
        const IconComponent = ICON_MAP[route.name];

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem} accessibilityRole="button" accessibilityState={{ selected: isFocused }}>
            {/* Top Indicator Line */}
            {isFocused && <View style={styles.activeIndicator} />}

            {/* Icon */}
            {IconComponent && <IconComponent stroke={getIconColor(isFocused)} size={wp(6)} />}

            {/* Label */}
            <AppText numberOfLines={1} style={[styles.label, isFocused && styles.labelFocused]}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const BottomTab = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true, // Hides tab bar when keyboard opens
      }}>
      <Tab.Screen name={TABS.HOME} component={HomeTabStack} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name={TABS.REPORTS} component={ReportTabStack} options={{ tabBarLabel: t('tabs.reports') }} />
      <Tab.Screen name={TABS.INSPECTION} component={InspectionTabStack} options={{ tabBarLabel: t('tabs.inspection') }} />
      <Tab.Screen name={TABS.MY_TRIPS} component={MyTripsTabStack} options={{ tabBarLabel: t('tabs.myTrips') }} />
      <Tab.Screen name={TABS.PROFILE} component={ProfileTabStack} options={{ tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: wp(100), // Force full width
    height: hp(10), // Fixed height
    backgroundColor: colors.white,
    // Using simple centering because items have fixed width
    alignItems: 'center',

    // Shadow Styling
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: Platform.OS === 'android' ? 0 : 0.5,
    borderTopColor: '#e0e0e0',
  },

  // STANDARD TAB ITEM
  tabItem: {
    width: wp(20), // KEY FIX: Exactly 20% of screen width (100/5 tabs)
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // Removed 'gap' to ensure safer alignment across older RN versions
  },

  // MIDDLE BUTTON WRAPPER
  inspectionWrapper: {
    width: wp(20), // KEY FIX: Keeps the middle slot exactly same size as others
    height: '100%',
    justifyContent: 'flex-start', // Align to top so we can push button up
    alignItems: 'center',
    zIndex: 10, // Ensure it floats above
  },

  inspectionButton: {
    width: wp(14),
    height: wp(14),
    marginTop: -hp(1.7), // Pulls the button upwards outside the container
    alignItems: 'center',
    justifyContent: 'center',

    // Shadow for the button circle
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 0,
    backgroundColor: 'transparent', // Ensure background behind icon if needed
    borderRadius: wp(100), // Make it perfectly round
  },

  // TEXT STYLES
  label: {
    fontSize: wp(2.8),
    marginTop: hp(0.5),
    color: colors.slateGray,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%', // Ensure text centers in its 20% box
  },

  inspectionLabel: {
    fontSize: wp(2.8),
    marginTop: hp(1), // Spacing between floating circle and text
    color: colors.slateGray,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },

  labelFocused: {
    color: colors.oceanBlue,
    fontWeight: '700',
  },

  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: wp(10),
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.oceanBlue,
  },
});
