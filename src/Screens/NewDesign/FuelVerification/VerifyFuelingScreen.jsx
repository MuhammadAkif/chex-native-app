import React, { useEffect,useState } from 'react';
import { FlatList, ScrollView, StatusBar, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { ROUTES } from '../../../Navigation/ROUTES';
import { recentFuelEvents } from '../../../Store/Actions';
import { styles } from './styles';

const VerifyFuelingScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const recentEventsFromStore = useSelector(state => state.fuel?.recentFuelEvents || []);
  const fuelEventMetricsFromStore = useSelector(state => state.fuel?.fuelEventMetrics || null);

  const [recentEvents, setRecentEvents] = useState(recentEventsFromStore);
  const [fuelEventMetrics, setFuelEventMetrics] = useState(fuelEventMetricsFromStore);

  useEffect(() => {
    setRecentEvents(recentEventsFromStore);
    setFuelEventMetrics(fuelEventMetricsFromStore);
  }, [recentEventsFromStore]);

  useEffect(() => {
    dispatch(recentFuelEvents());
  }, [dispatch]);

  console.log('fuelEventMetrics /////', fuelEventMetrics);

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
            <AppText style={styles.title}>{t('fuelVerification.title')}</AppText>
            <AppText style={styles.subtitle}>{t('fuelVerification.subtitle')}</AppText>

            <PrimaryGradientButton
              text={t('fuelVerification.startVerification')}
              buttonStyle={styles.heroButton}
              onPress={() => navigation.navigate(ROUTES.CONFIRM_FUEL_VEHICLE)}
            />

            <View style={styles.heroStatsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.heroStatValue}>{fuelEventMetrics?.totalActiveEvents || 0}</AppText>
                <AppText style={styles.heroStatLabel}>{t('fuelVerification.thisWeek')}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.heroStatValue}>${fuelEventMetrics?.totalSpend || 0}</AppText>
                <AppText style={styles.heroStatLabel}>{t('fuelVerification.totalSpend')}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.heroStatValue}>{fuelEventMetrics?.complianceScore || 0}%</AppText>
                <AppText style={styles.heroStatLabel}>{t('fuelVerification.compliance')}</AppText>
              </View>
            </View>
          </CardWrapper>

          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>{t('fuelVerification.recentFuelEvents')}</AppText>
            {/* <AppText style={styles.sectionLink}>See all</AppText> */}
          </View>

          <FlatList
            data={recentEvents}
            keyExtractor={(item, index) => String(item?.eventId ?? index)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <CardWrapper style={styles.eventCard}>
                <View style={[styles.eventIcon, styles.eventIconAmber]}>
                  <AppText style={styles.eventIconText}>⛽</AppText>
                </View>
                <View style={styles.eventInfo}>
                  <AppText style={styles.eventStation}>{item?.stationName || '-'}</AppText>
                  <AppText style={styles.eventMeta}>
                    {item?.submittedAt || '-'}
                    {item?.receiptGallons != null ? ` - ${item.receiptGallons}` : ''}
                  </AppText>
                </View>
                <View style={styles.eventRight}>
                  <AppText style={styles.eventAmount}>
                    {item?.receiptTotal != null ? `$${item.receiptTotal}` : '--'}
                  </AppText>
                  <AppText style={[styles.statusBadge, styles.statusReview]}>
                    {item?.fraudScore != null ? `Fraud: ${item.fraudScore}` : 'Fraud: -'}
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
