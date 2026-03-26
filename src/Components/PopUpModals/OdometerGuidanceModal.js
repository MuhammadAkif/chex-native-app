import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import { Check, Cross } from '../../Assets/Icons';
import { colors } from '../../Assets/Styles';

const { white } = colors;

const OdometerGuidanceModal = ({ visible, onClose, onDoNotShowAgain }) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleDoNotShowAgain = () => {
    setIsChecked(!isChecked);
  };
  const onCloseModal = () => {
    onClose(isChecked);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCloseModal}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{t('odometerGuidance.title')}</Text>
            <TouchableOpacity onPress={onCloseModal} style={styles.crossButton}>
              <Cross height={hp('3%')} width={wp('6%')} color={white} />
            </TouchableOpacity>
          </View>

          <Video
            source={require('../../Assets/Videos/Realistic_Car_Odometer_Capture_Demo.mp4')}
            style={styles.video}
            controls={false}
            resizeMode="contain"
            repeat={true}
            paused={false}
            playInBackground={false}
          />

          <Text style={styles.description}>
            {t('odometerGuidance.description')}
          </Text>

          <TouchableOpacity style={styles.checkboxRow} onPress={handleToggleDoNotShowAgain} activeOpacity={0.8}>
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
              {isChecked ? <Check height={hp('1.4%')} width={wp('3.2%')} color={white} /> : null}
            </View>
            <Text style={styles.checkboxLabel}>{t('odometerGuidance.doNotShowAgain')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  container: {
    width: '100%',
    backgroundColor: '#1F2B4D',
    borderRadius: 14,
    padding: wp('4%'),
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.2%'),
  },
  crossButton: {
    padding: 2,
  },
  title: {
    color: white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: hp('0.5%'),
  },
  video: {
    width: '100%',
    height: hp('28%'),
    borderRadius: 10,
    backgroundColor: '#000',
  },
  description: {
    color: white,
    marginTop: hp('1.5%'),
    fontSize: 13,
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  checkbox: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.5%'),
  },
  checkboxChecked: {
    backgroundColor: '#F58E00',
    borderColor: '#F58E00',
  },
  checkboxLabel: {
    color: white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OdometerGuidanceModal;
