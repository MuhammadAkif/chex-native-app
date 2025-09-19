import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES, STACKS} from './ROUTES';
import {stackScreenOptions} from './navigationOptions';
import {
  ForgotPasswordContainer,
  InspectionReviewedContainer,
  RegisterContainer,
  ResetPasswordContainer,
  SignInContainer,
  WelcomeContainer,
} from '../Container';
import Home from '../Screens/NewDesign/Home';
import {VehicleInformation} from '../Screens';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Pressable, StatusBar, View} from 'react-native';
import {colors} from '../Assets/Styles';
import AppText from '../Components/text';
import {useDispatch} from 'react-redux';
import {signOut} from '../Store/Actions';

const Stack = createNativeStackNavigator();

const MyTripsScreen = () => {
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={colors.black} translucent barStyle={'dark-content'} />
      <AppText>{'My Trips'}</AppText>
    </SafeAreaView>
  );
};

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigation.replace(STACKS.AUTH_STACK);
    setTimeout(() => {
      dispatch(signOut());
    }, 100);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={colors.black} translucent barStyle={'dark-content'} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Pressable onPress={handleLogout} style={{backgroundColor: colors.red, padding: 5, borderRadius: 10}}>
          <AppText color={colors.white} fontWeight={'700'}>
            Logout
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export const AuthStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.WELCOME} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.WELCOME} component={WelcomeContainer} />
    <Stack.Screen name={ROUTES.REGISTER} component={RegisterContainer} />
    <Stack.Screen name={ROUTES.SIGN_IN} component={SignInContainer} />
    <Stack.Screen name={ROUTES.FORGET_PASSWORD} component={ForgotPasswordContainer} />
    <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordContainer} />
  </Stack.Navigator>
);

// BOTTOM TAB STACKS
export const HomeTabStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.HOME} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.HOME} component={Home} />
  </Stack.Navigator>
);

export const ReportTabStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.INSPECTION_REVIEWED} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.INSPECTION_REVIEWED} component={InspectionReviewedContainer} />
  </Stack.Navigator>
);

export const InspectionTabStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.VEHICLE_INFORMATION} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.VEHICLE_INFORMATION} component={VehicleInformation} />
  </Stack.Navigator>
);

export const MyTripsTabStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.MY_TRIPS} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.MY_TRIPS} component={MyTripsScreen} />
  </Stack.Navigator>
);

export const ProfileTabStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.PROFILE} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
  </Stack.Navigator>
);
