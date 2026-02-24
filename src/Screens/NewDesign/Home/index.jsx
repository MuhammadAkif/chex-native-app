import { View, StatusBar, ScrollView, Image, FlatList, RefreshControl, ActivityIndicator, BackHandler, Platform } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import AppText from '../../../Components/text';
import { AlertPopup, CardWrapper, InspectionCard, LogoHeader, VehicleCard } from '../../../Components';
import { colors } from '../../../Assets/Styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BlueTruckStatIcon, DownArrow, InProgressStatIcon, SubmittedStatIcon, TotalStatIcon } from '../../../Assets/Icons';
import { IMAGES } from '../../../Assets/Images';
import { ROUTES, TABS } from '../../../Navigation/ROUTES';
import { useNavigation } from '@react-navigation/native';
import { getUserInspectionStats, getRegisteredVehicles, getRecentInspections } from '../../../services/inspection';
import { useSelector } from 'react-redux';
import { getUserFullName } from '../../../Utils/helpers';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { ANDROID, exitAppInfo, HARDWARE_BACK_PRESS, INSPECTION_STATUS_FOR_RECENT_INSPECTION } from '../../../Constants';
import { useContinueInspection, useInspectionDetails } from '../../../hooks';

const Home = ({ navigation }) => {
  const { t } = useTranslation();
  const authState = useSelector(state => state?.auth);
  const isScreenFocused = useIsFocused()
  const isFirstTimeLoad = useRef(true)
  const user = authState?.user?.data;
  const [userInspectionStats, setUserInspectionStats] = useState({
    totalVehicles: 0,
    inProgressInspections: 0,
    submittedInspections: 0,
    totalInspections: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isVehicleRegisterLoading, setIsVehicleRegisterLoading] = useState(false);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);
  const [isRecentInspectionLoading, setIsRecentInspectionLoading] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  const getUserInspectionStatsAPI = async () => {
    if (isFirstTimeLoad.current) setIsStatsLoading(true);
    const response = await getUserInspectionStats();
    setIsStatsLoading(false);

    const { totalVehicles = 0, inProgressInspections = 0, submittedInspections = 0, totalInspections = 0 } = response?.data || {};
    setUserInspectionStats({ totalVehicles, inProgressInspections, submittedInspections, totalInspections });
  };

  const getRegisteredVehiclesAPI = async () => {
    if (isFirstTimeLoad.current) setIsVehicleRegisterLoading(true);
    const response = await getRegisteredVehicles();
    setIsVehicleRegisterLoading(false);

    const { vehicles = [] } = response?.data || {};
    setVehiclesData(vehicles.reverse());
  };

  const getRecentInspectionsAPI = () => {
    if (isFirstTimeLoad.current) setIsRecentInspectionLoading(true);
    getRecentInspections()
      .then(response => {
        if (response.status === 200) {
          setRecentInspections(response?.data.inspections);
        }
      })
      .finally(() => {
        setIsRecentInspectionLoading(false);
      });
  };

  useEffect(() => {
    if (isScreenFocused) {
      getHomeData();
    }
  }, [isScreenFocused]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, hardwareBackPress);
      return () => backHandler.remove();
    }, [])
  );

  function hardwareBackPress() {
    if (Platform.OS === ANDROID) {
      setShowExitPopup(true);
      return true;
    }
  }

  function onExitCancelPress() {
    setShowExitPopup(false);
    return null;
  }

  function onExitPress() {
    setShowExitPopup(false);
    BackHandler.exitApp();
  }

  const getHomeData = () => {
    getUserInspectionStatsAPI();
    getRegisteredVehiclesAPI();
    getRecentInspectionsAPI();
    isFirstTimeLoad.current = false;
  };

  const handlePressStatCard = id => {
    if (id === 1) navigation.navigate(ROUTES.INSPECTION_IN_PROGRESS);
    else if (id === 2) navigation.navigate(TABS.REPORTS);
  };

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />

      <ScrollView
        refreshControl={<RefreshControl refreshing={false} colors={[colors.white, colors.orange]} onRefresh={getHomeData} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.container}>
        {/* BLUE HEADER */}
        <View style={styles.blueHeaderContainer}>
          <LogoHeader showLeft={false} />

          <View style={styles.usernameContainer}>
            <AppText color={colors.white} fontSize={wp(6)} style={styles.username}>
              {t('home.greeting', { name: getUserFullName(user?.name, user?.lastName) })}
            </AppText>
            <AppText color={colors.white}>{t('home.subtitle')}</AppText>
          </View>

          <Image source={IMAGES.VanOutline} style={styles.vanoutlineContainer} />
        </View>

        {/* WHITE CONTAINER */}
        <View style={styles.whiteContainerContent}>
          <View style={styles.statsContainer}>
            <StatBox
              title={t('home.stats.totalVehicles')}
              icon={BlueTruckStatIcon}
              count={isStatsLoading ? '...' : userInspectionStats.totalVehicles}
              id={0}
            />
            <StatBox
              title={t('home.stats.inProgressInspections')}
              icon={InProgressStatIcon}
              count={isStatsLoading ? '...' : userInspectionStats.inProgressInspections}
              id={1}
              onPress={handlePressStatCard}
              showArrow
            />
            <StatBox
              title={t('home.stats.submittedInspections')}
              icon={SubmittedStatIcon}
              count={isStatsLoading ? '...' : userInspectionStats.submittedInspections}
              id={2}
              onPress={handlePressStatCard}
              showArrow
            />
            <StatBox
              title={t('home.stats.totalInspections')}
              icon={TotalStatIcon}
              count={isStatsLoading ? '...' : userInspectionStats.totalInspections}
              id={3}
            />
          </View>

          <View style={styles.withHeadingContentContainer}>
            <View style={styles.sectionWrapper}>
              <AppText style={styles.headingText}>{t('home.recentInspections')}</AppText>
              <RecentInspections data={recentInspections} isLoading={isRecentInspectionLoading} />
            </View>

            <View style={styles.sectionWrapper}>
              <AppText style={styles.headingText}>{t('home.myRegisteredVehicles')}</AppText>
              <RegisteredVehicles data={vehiclesData} isLoading={isVehicleRegisterLoading} />
            </View>
          </View>
        </View>
      </ScrollView>

      <AlertPopup
        visible={showExitPopup}
        onYesPress={onExitPress}
        onCancelPress={onExitCancelPress}
        title={exitAppInfo.title}
        message={exitAppInfo.message}
        yesButtonText={exitAppInfo.button.yes}
        cancelButtonText={exitAppInfo.button.cancel}
      />
    </View>
  );
};

const StatBox = ({ count = 0, icon: Icon, title, id, onPress, showArrow = false }) => {
  return (
    <CardWrapper onPress={() => onPress?.(id)} style={styles.statBoxContainer}>
      <View style={styles.numberAndIcon}>
        <AppText fontSize={wp(9)} style={styles.statNumberText}>
          {count}
        </AppText>
        <Icon />
      </View>
      <AppText fontSize={wp(3.5)} color={colors.steelGray} style={styles.statText}>
        {title}
      </AppText>
      {showArrow && <DownArrow style={{ transform: [{ rotate: '270deg' }], position: "absolute", right: wp(3), bottom: wp(3) }} color={colors.lightSteelBlue} height={wp(4.5)} width={wp(4.5)} />}
    </CardWrapper>
  );
};

const RegisteredVehicles = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handlePressCard = (item) => {
    setSelectedVehicle(item);
    setAlertVisible(true);
  };

  const handleConfirmInspection = () => {
    setAlertVisible(false);
    if (!selectedVehicle) return;

    navigation.navigate(TABS.INSPECTION, {
      screen: ROUTES.VEHICLE_INFORMATION, params: {
        licensePlateNumber: selectedVehicle?.licensePlateNumber,
        vehicleType: selectedVehicle?.vehicleType,
        vin: selectedVehicle?.vin,
        isFromRegisteredVehicle: true,
      }
    });
    setSelectedVehicle(null);
  };

  const handleCancelInspection = () => {
    setAlertVisible(false);
    setSelectedVehicle(null);
  };

  return (
    <>

      <FlatList
        horizontal
        data={data}
        style={styles.vehicleList}
        contentContainerStyle={styles.vehicleContentList}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => <VehicleCard onPress={() => handlePressCard(item)} item={item} />}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.registerVehicleLoader} size={'small'} color={colors.royalBlue} />
          ) : (
            <AppText style={styles.noRegisterText}>{t('home.noRegisteredVehicle')}</AppText>
          )
        }
      />

      <AlertPopup
        visible={alertVisible}
        title={t('vehicleInfo.Info') || 'Info'}
        message={t('vehicleInfo.startInspection')}
        yesButtonText={t('common.yes') || 'Yes'}
        cancelButtonText={t('common.no') || 'No'}
        onYesPress={handleConfirmInspection}
        onCancelPress={handleCancelInspection}
      />

    </>
  );
};

const RecentInspections = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const { handleContinuePress, isLoading: isContinueLoading, activeInspectionId } = useContinueInspection();
  const { handleInspectionDetailsPress, isLoading: isDetailLoading, selectedInspectionId } = useInspectionDetails();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handlePressInspectionCard = (item) => {
    if (isContinueLoading || isDetailLoading) return;

    const inspectionId = item?.id;
    const itemStatus = INSPECTION_STATUS_FOR_RECENT_INSPECTION[item?.status];

    if (itemStatus === INSPECTION_STATUS_FOR_RECENT_INSPECTION.IN_PROGRESS) {
      handleContinuePress(inspectionId);
    } else if (itemStatus === INSPECTION_STATUS_FOR_RECENT_INSPECTION.REVIEWED) {
      handleInspectionDetailsPress(inspectionId);
    } else if (itemStatus === INSPECTION_STATUS_FOR_RECENT_INSPECTION.IN_REVIEW || itemStatus === INSPECTION_STATUS_FOR_RECENT_INSPECTION.READY_FOR_REVIEW || itemStatus === INSPECTION_STATUS_FOR_RECENT_INSPECTION.IN_PROCESS) {
      setAlertMessage(t('home.inspectionUnderReview'));
      setAlertVisible(true);
    }
  };

  return (
    <>
      <FlatList
        horizontal
        data={data}
        style={styles.vehicleList}
        contentContainerStyle={styles.vehicleContentList}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <InspectionCard
            onPress={handlePressInspectionCard}
            item={item}
            isLoading={(isContinueLoading && activeInspectionId === item.id) || (isDetailLoading && selectedInspectionId === item.id)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.registerVehicleLoader} size={'small'} color={colors.royalBlue} />
          ) : (
            <AppText style={styles.noRegisterText}>{t('home.noRecentInspection')}</AppText>
          )
        }
      />

      <AlertPopup
        visible={alertVisible}
        title="Info"
        message={alertMessage}
        yesButtonText={t('common.ok') || 'OK'}
        onYesPress={() => setAlertVisible(false)}
      />
    </>
  );
};

export default Home;
