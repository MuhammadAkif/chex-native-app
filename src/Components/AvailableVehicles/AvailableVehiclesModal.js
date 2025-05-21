import React from 'react';
import {FlatList, Modal, Text, View} from 'react-native';

import styles from './styles';
import {Car} from '../../Assets/Icons';
import {SecondaryButton} from '../index';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../Assets/Styles';

const {royalBlue} = colors;

const AvailableDevicesModal = ({
  visible = true,
  data = [],
  RenderDevices,
  onSelectPress,
  onCancelPress,
}) => (
  <Modal animationType="slide" transparent={true} visible={visible}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={[styles.modalHeader, styles.fieldGap]}>
          <View style={styles.iconContainer}>
            <Car height={hp('3%')} width={wp('7%')} color={royalBlue} />
          </View>
          <Text style={styles.modalTitle}>Available Vehicles</Text>
        </View>
        <View style={[styles.modalBody, styles.fieldGap]}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <RenderDevices item={item} onPress={onSelectPress} />
            )}
            keyExtractor={(item, index) => item.id}
          />
        </View>
        <View style={styles.modalFooter}>
          <SecondaryButton
            text={'Cancel'}
            textStyle={styles.cancelTextStyle}
            buttonStyle={styles.cancelButton}
            onPress={onCancelPress}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default AvailableDevicesModal;
