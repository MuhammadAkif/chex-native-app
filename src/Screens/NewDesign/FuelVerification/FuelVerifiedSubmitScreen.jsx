import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StatusBar, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleSheet } from 'react-native';
import { LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { clearFuelEvent } from '../../../Store/Actions';
import { ROUTES } from '../../../Navigation/ROUTES';
import { colors } from '../../../Assets/Styles';

const FuelVerifiedSubmitScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fuelEvent = useSelector(state => state.fuel?.fuelEvent);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleDone = () => {
    dispatch(clearFuelEvent());
    navigation.navigate(ROUTES.HOME);
  };

  const progressPips = [0, 1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
        <View style={styles.flowHeader}>
          <AppText style={styles.stepText}>{t('fuelVerification.stepConfirmation')}</AppText>
          <AppText style={styles.title}>{t('fuelVerification.fuelingVerifiedTitle')}</AppText>
          <View style={styles.progressTrack}>
            {progressPips.map(index => (
              <View key={index} style={[styles.progressPip, styles.progressPipDone]} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.confirmCenter}>
            <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
              <AppText style={styles.iconEmoji}>✅</AppText>
            </Animated.View>

            <AppText style={styles.confirmTitle}>
              {t('fuelVerification.fuelingVerifiedTitle')}
            </AppText>
            <AppText style={styles.confirmSubtitle}>
              {t('fuelVerification.fuelingVerifiedSubtitle')}
            </AppText>

            {fuelEvent?.id ? (
              <View style={styles.eventIdBadge}>
                <AppText style={styles.eventIdText}>
                  {`${fuelEvent.id}`}
                </AppText>
              </View>
            ) : null}
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.scoreDisplay}>
              <View>
                <AppText style={styles.scoreLabelMain}>
                  {t('fuelVerification.fraudScore')}
                </AppText>
                <AppText style={styles.scoreDesc}>
                  {t('fuelVerification.allChecksPassed')}
                </AppText>
              </View>
              <AppText style={styles.scoreNum}>
                {fuelEvent?.fraudScore ?? '—'}
              </AppText>
            </View>

            <View style={styles.dataRow}>
              <AppText style={styles.dataKey}>{t('fuelVerification.gallonsAdded')}</AppText>
              <AppText style={styles.dataVal}>
                {fuelEvent?.receiptGallons ? `${fuelEvent.receiptGallons} gal` : '--'}
              </AppText>
            </View>

            <View style={styles.dataRow}>
              <AppText style={styles.dataKey}>{t('fuelVerification.totalCost')}</AppText>
              <AppText style={styles.dataVal}>{fuelEvent?.receiptTotal ?? '--'}</AppText>
            </View>

            <View style={styles.dataRow}>
              <AppText style={styles.dataKey}>{t('fuelVerification.station')}</AppText>
              <AppText style={styles.dataVal}>{fuelEvent?.receiptMerchant ?? '--'}</AppText>
            </View>

            <View style={[styles.dataRow, styles.dataRowLast]}>
              <AppText style={styles.dataKey}>{t('fuelVerification.mpgThisTank')}</AppText>
              <AppText style={styles.dataVal}>
                {fuelEvent?.mpg ? `${fuelEvent.mpg} mpg ✓` : '--'}
              </AppText>
            </View>
          </View>

          <PrimaryGradientButton
            text={t('fuelVerification.done')}
            buttonStyle={styles.doneButton}
            onPress={handleDone}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.royalBlue },
  blueHeaderContainer: { backgroundColor: colors.royalBlue },
  flowHeader: { paddingHorizontal: wp(5.3), paddingTop: hp(0.5), paddingBottom: hp(2.2) },
  cardWrapper: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(2.2),
    gap: hp(1.8),
    paddingBottom: hp(4),
    alignItems: 'center',
  },
  stepText: { color: '#D6E3F2', fontSize: wp(3.2), marginTop: hp(0.2) },
  title: { fontSize: wp(5), fontWeight: '700', color: colors.white },
  progressTrack: { flexDirection: 'row', gap: wp(1.1), marginTop: hp(1.3) },
  progressPip: { height: 4, borderRadius: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  progressPipDone: { backgroundColor: colors.orangePeel },

  confirmCenter: { alignItems: 'center', marginTop: hp(1) },

  iconWrap: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  iconEmoji: { fontSize: wp(9) },

  confirmTitle: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#343A40',
    marginBottom: hp(0.8),
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontSize: wp(3.4),
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: hp(1.5),
    paddingHorizontal: wp(2),
  },

  eventIdBadge: {
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  eventIdText: {
    fontFamily: 'monospace',
    fontSize: wp(3),
    fontWeight: '600',
    color: '#6C757D',
  },

  detailsCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 16,
    padding: wp(4),
  },

  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(1.5),
  },
  scoreLabelMain: {
    fontSize: wp(2.8),
    fontWeight: '700',
    color: '#16A34A',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scoreDesc: { fontSize: wp(3.2), color: '#495057', marginTop: hp(0.2) },
  scoreNum: { fontSize: wp(8), fontWeight: '700', color: '#16A34A' },

  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(0.9),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  dataRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  dataKey: { fontSize: wp(3.4), color: '#6C757D' },
  dataVal: { fontSize: wp(3.4), fontWeight: '600', color: '#343A40' },

  doneButton: { width: wp(70), borderRadius: wp(3), marginTop: hp(0.5) },
});

export default FuelVerifiedSubmitScreen;
