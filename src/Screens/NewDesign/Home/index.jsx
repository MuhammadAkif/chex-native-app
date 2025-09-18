import {View, StatusBar, ScrollView, Image, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import AppText from '../../../Components/text';
import {CardWrapper, IconWrapper, InspectionCard, LogoHeader, VehicleCard} from '../../../Components';
import {colors} from '../../../Assets/Styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {BellWhiteIcon, BlueTruckStatIcon, HamburgerIcon, InProgressStatIcon, SubmittedStatIcon, TotalStatIcon} from '../../../Assets/Icons';
import {IMAGES} from '../../../Assets/Images';
import {ROUTES, TABS} from '../../../Navigation/ROUTES';
import {getUserInspectionStats, getRegisteredVehicles} from '../../../services/inspection';

const Home = ({navigation}) => {
  const [userInspectionStats, setUserInspectionStats] = useState({
    totalVehicles: 0,
    inProgressInspections: 0,
    submittedInspections: 0,
    totalInspections: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [vehiclesData, setVehiclesData] = useState([]);

  const RecentInpsectionData = [
    {licencseNumber: 'ABC-123', id: 'ID: VH-2847', status: 'Passed'},
    {licencseNumber: 'XYZ-123', id: 'ID: VH-2848', status: 'Pending', days: '2 day'},
  ];

  const getUserInspectionStatsAPI = async () => {
    setIsStatsLoading(true);
    const response = await getUserInspectionStats();
    const {totalVehicles = 0, inProgressInspections = 0, submittedInspections = 0, totalInspections = 0} = response?.data || {};
    setUserInspectionStats({totalVehicles, inProgressInspections, submittedInspections, totalInspections});
    setIsStatsLoading(false);
  };

  const getRegisteredVehiclesAPI = async () => {
    const response = await getRegisteredVehicles();
    const {vehicles = []} = response?.data || {};
    console.log('vehicles:', vehicles);
    setVehiclesData(vehicles);
  };

  useEffect(() => {
    getUserInspectionStatsAPI();
    getRegisteredVehiclesAPI();
  }, []);

  const handlePressStatCard = id => {
    if (id === 1) navigation.navigate(ROUTES.INSPECTION_IN_PROGRESS);
    else if (id === 2) navigation.navigate(TABS.REPORTS);
  };

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />

      <ScrollView
        refreshControl={<RefreshControl refreshing={isStatsLoading} colors={[colors.white, colors.orange]} onRefresh={getUserInspectionStatsAPI} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.container}>
        {/* BLUE HEADER */}
        <View style={styles.blueHeaderContainer}>
          <LogoHeader
            showLeft={false}
            rightIcon={
              <IconWrapper>
                <BellWhiteIcon />
              </IconWrapper>
            }
          />

          <View style={styles.usernameContainer}>
            <AppText color={colors.white} fontSize={wp(6)} style={styles.username}>
              Hi, Ali Tariq
            </AppText>
            <AppText color={colors.white}>Let's check your vehicle today</AppText>
          </View>

          <Image source={IMAGES.VanOutline} style={styles.vanoutlineContainer} />
        </View>

        {/* WHITE CONTAINER */}
        <View style={styles.whiteContainerContent}>
          <View style={styles.statsContainer}>
            <StatBox title={'Total\nVehicles'} icon={BlueTruckStatIcon} count={isStatsLoading ? '...' : userInspectionStats.totalVehicles} id={0} />
            <StatBox
              title={'In Progress\nInspections'}
              icon={InProgressStatIcon}
              count={isStatsLoading ? '...' : userInspectionStats.inProgressInspections}
              id={1}
              onPress={handlePressStatCard}
            />
            <StatBox
              title={'Submitted\nInspections'}
              icon={SubmittedStatIcon}
              count={isStatsLoading ? '...' : userInspectionStats.submittedInspections}
              id={2}
              onPress={handlePressStatCard}
            />
            <StatBox title={'Total\nInspections'} icon={TotalStatIcon} count={isStatsLoading ? '...' : userInspectionStats.totalInspections} id={3} />
          </View>

          <View style={styles.withHeadingContentContainer}>
            <View style={styles.sectionWrapper}>
              <AppText style={styles.headingText}>My Registered Vehicles</AppText>
              <RegisteredVehicles data={vehiclesData} />
            </View>

            <View style={styles.sectionWrapper}>
              <AppText style={styles.headingText}>Recent Inspections</AppText>
              <RecentInspections data={RecentInpsectionData} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const StatBox = ({count = 0, icon: Icon, title, id, onPress}) => {
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
    </CardWrapper>
  );
};

const RegisteredVehicles = ({data}) => {
  return (
    <FlatList
      horizontal
      data={data}
      style={styles.vehicleList}
      contentContainerStyle={styles.vehicleContentList}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => <VehicleCard item={item} />}
    />
  );
};

const RecentInspections = ({data}) => {
  return (
    <FlatList
      horizontal
      data={data}
      style={styles.vehicleList}
      contentContainerStyle={styles.vehicleContentList}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => <InspectionCard item={item} />}
    />
  );
};

export default Home;
