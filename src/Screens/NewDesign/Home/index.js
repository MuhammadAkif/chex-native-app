import {View, StatusBar, TouchableOpacity, ScrollView, Image, FlatList} from 'react-native';
import React from 'react';
import {styles} from './styles';
import AppText from '../../../Components/text';
import {SafeAreaView} from 'react-native-safe-area-context';
import {InspectionCard, SignInLogo, VehicleCard} from '../../../Components';
import {PROJECT_NAME} from '../../../Constants';
import {colors} from '../../../Assets/Styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {BellWhiteIcon, BlueTruckStatIcon, HamburgerIcon, InProgressStatIcon, SubmittedStatIcon, TotalStatIcon} from '../../../Assets/Icons';
import {IMAGES} from '../../../Assets/Images';

const Home = () => {
  const VehiclesData = [
    {name: 'Macapa Logistics LLC', licencseNumber: '145-1234', status: 'Reviewed', timestamp: 'Jun 3, 2025 3:33PM', image: IMAGES.Van},
    {name: 'Macapa Logistics LLC', licencseNumber: '145-1234', status: 'Reviewed', timestamp: 'Jun 3, 2025 3:33PM', image: IMAGES.Van},
    {name: 'Macapa Logistics LLC', licencseNumber: '145-1234', status: 'Reviewed', timestamp: 'Jun 3, 2025 3:33PM', image: IMAGES.Van},
  ];

  const RecentInpsectionData = [
    {licencseNumber: 'ABC-123', id: 'ID: VH-2847', status: 'Passed'},
    {licencseNumber: 'XYZ-123', id: 'ID: VH-2848', status: 'Pending', days: '2 day'},
  ];

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer} style={styles.container}>
        {/* BLUE HEADER */}
        <View style={styles.blueHeaderContainer}>
          <SafeAreaView>
            <View style={styles.headerContentContainer}>
              <IconWrapper>
                <HamburgerIcon />
              </IconWrapper>

              <SignInLogo
                titleText={PROJECT_NAME.CHEX}
                dotTitleText={PROJECT_NAME.AI}
                textStyle={styles.logo}
                nestedTextStyle={styles.logo}
                containerStyle={styles.logoContainer}
              />

              <IconWrapper>
                <BellWhiteIcon />
              </IconWrapper>
            </View>

            <View style={styles.usernameContainer}>
              <AppText color={colors.white} fontSize={wp(6)} style={styles.username}>
                Hi, Ali Tariq
              </AppText>
              <AppText color={colors.white}>Let's check your vehicle today</AppText>
            </View>
          </SafeAreaView>

          <Image source={IMAGES.VanOutline} style={styles.vanoutlineContainer} />
        </View>

        {/* WHITE CONTAINER */}
        <View style={styles.whiteContainerContent}>
          <View style={styles.statsContainer}>
            <StatBox title={'Total\nVehicles'} icon={BlueTruckStatIcon} count={8} />
            <StatBox title={'In Progress\nInspections'} icon={InProgressStatIcon} count={2} />
            <StatBox title={'Submitted\nInspections'} icon={SubmittedStatIcon} count={3} />
            <StatBox title={'Total\nInspections'} icon={TotalStatIcon} count={8} />
          </View>

          <View style={styles.withHeadingContentContainer}>
            <View style={styles.sectionWrapper}>
              <AppText style={styles.headingText}>My Registered Vehicles</AppText>
              <RegisteredVehicles data={VehiclesData} />
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

const IconWrapper = ({children}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.iconWrapperContainer}>
      {children}
    </TouchableOpacity>
  );
};

const StatBox = ({count = 0, icon: Icon, title}) => {
  return (
    <CardWrapper style={styles.statBoxContainer}>
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

const CardWrapper = ({children, style}) => {
  return <View style={[styles.cardContainer, style]}>{children}</View>;
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
      renderItem={({item, index}) => <VehicleCard item={item} CardWrapper={CardWrapper} />}
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
      renderItem={({item, index}) => <InspectionCard item={item} CardWrapper={CardWrapper} />}
    />
  );
};

export default Home;
