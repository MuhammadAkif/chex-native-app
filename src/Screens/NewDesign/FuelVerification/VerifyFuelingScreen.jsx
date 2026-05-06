import React from 'react';
import { FlatList, ScrollView, StatusBar, View } from 'react-native';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { ROUTES } from '../../../Navigation/ROUTES';
import { styles } from './styles';

const DUMMY_RECENT_EVENTS = [
  { id: '1', station: 'Shell - Harbor Blvd', meta: 'Today - 9:38 AM - 12.4 gal', amount: '$52.20', status: 'Verified', statusType: 'verified', iconBg: styles.eventIconGreen },
  { id: '2', station: 'Chevron - Main St', meta: 'Yesterday - 2:15 PM - 8.1 gal', amount: '$34.02', status: 'Under review', statusType: 'review', iconBg: styles.eventIconAmber },
  { id: '3', station: 'Arco - Industrial Dr', meta: 'Mon - 7:22 AM - 14.2 gal', amount: '$58.80', status: 'Verified', statusType: 'verified', iconBg: styles.eventIconGreen },
];

const VerifyFuelingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          <CardWrapper style={styles.heroCard}>
            <AppText style={styles.heroBadge}>⛽ FuelGuard</AppText>
            <AppText style={styles.title}>Verify your fueling</AppText>
            <AppText style={styles.subtitle}>Log fuel quickly and stay compliant</AppText>

            <PrimaryGradientButton
              text="Start verification"
              buttonStyle={styles.heroButton}
              onPress={() => navigation.navigate(ROUTES.CONFIRM_FUEL_VEHICLE)}
            />

            <View style={styles.heroStatsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.heroStatValue}>3</AppText>
                <AppText style={styles.heroStatLabel}>This week</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.heroStatValue}>$142</AppText>
                <AppText style={styles.heroStatLabel}>Total spend</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.heroStatValue}>100%</AppText>
                <AppText style={styles.heroStatLabel}>Compliance</AppText>
              </View>
            </View>
          </CardWrapper>

          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Recent fuel events</AppText>
            {/* <AppText style={styles.sectionLink}>See all</AppText> */}
          </View>

          <FlatList
            data={DUMMY_RECENT_EVENTS}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <CardWrapper style={styles.eventCard}>
                <View style={[styles.eventIcon, item.iconBg]}>
                  <AppText style={styles.eventIconText}>⛽</AppText>
                </View>
                <View style={styles.eventInfo}>
                  <AppText style={styles.eventStation}>{item.station}</AppText>
                  <AppText style={styles.eventMeta}>{item.meta}</AppText>
                </View>
                <View style={styles.eventRight}>
                  <AppText style={styles.eventAmount}>{item.amount}</AppText>
                  <AppText style={[styles.statusBadge, item.statusType === 'verified' ? styles.statusVerified : styles.statusReview]}>
                    {item.status}
                  </AppText>
                </View>
              </CardWrapper>
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default VerifyFuelingScreen;
