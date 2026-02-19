import { View, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppText from './text';
import { colors } from '../Assets/Styles';
import CardWrapper from './Card/CardWrapper';

import { useTranslation } from 'react-i18next';

const InspectionCard = ({ item, onPress, isLoading = false }) => {
  const { t } = useTranslation();

  return (
    <CardWrapper style={styles.container} onPress={() => !isLoading && onPress?.(item)}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.royalBlue} />
        </View>
      ) : (
        <>
          <View style={styles.contentContainer}>
            <AppText fontSize={wp(3.8)} fontWeight={'800'}>
              {item?.licensePlateNumber}
            </AppText>
            <AppText color={colors.steelGray}>
              {t('inspectionCard.idLabel')}: {item?.inspectionCode}
            </AppText>
          </View>

          <View style={styles.inspectionBy}>
            {item?.userName && (
              <AppText color={colors.steelGray} fontSize={wp(2.8)}>
                {t('inspectionCard.byLabel')} {item?.userName}
              </AppText>
            )}
            <AppText color={colors.steelGray} fontSize={wp(2.8)}>
              {item?.timeAgo}
            </AppText>
          </View>
        </>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(45),
    height: wp(25),
    padding: wp(3.5),
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  rowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contentContainer: { gap: wp(1.3), flex: 1 },
  statusContainer: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(0.8),
    alignItems: 'center',
  },
  inspectionBy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  check: { position: 'absolute', right: wp(2), top: wp(2) },
});

export default InspectionCard;
