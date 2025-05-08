import React from 'react';
import {FlatList, Modal, Text, View} from 'react-native';

import styles from './styles';
import {Bluetooth} from '../../../Assets/Icons';
import {SecondaryButton} from '../../index';

const AvailableDevicesModal = ({
  visible = true,
  data = [],
  RenderDevices,
  ListHeaderComponent,
  onConnectPress,
  onRescanPress,
  onCancelPress,
}) => (
  <Modal animationType="slide" transparent={true} visible={visible}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={[styles.modalHeader, styles.fieldGap]}>
          <View style={styles.iconContainer}>
            <Bluetooth />
          </View>
          <Text style={styles.modalTitle}>Available Devices</Text>
        </View>
        <View style={[styles.modalBody, styles.fieldGap]}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <RenderDevices item={item} onPress={onConnectPress} />
            )}
            keyExtractor={item => item.id}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={() => (
              <ListHeaderComponent onPress={onRescanPress} />
            )}
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
