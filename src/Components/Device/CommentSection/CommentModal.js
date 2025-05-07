import React from 'react';
import {Modal, Text, TextInput, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import styles from './styles';
import {CommentIcon} from '../../../Assets/Icons';
import {colors} from '../../../Assets/Styles';
import {PrimaryGradientButton, SecondaryButton} from '../../index';

const {royalBlue, black} = colors;

const CommentModal = () => {
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.modalHeader, styles.fieldGap]}>
            <View style={styles.iconContainer}>
              <CommentIcon
                height={hp('7%')}
                width={wp('7%')}
                color={royalBlue}
              />
            </View>
            <Text style={styles.modalTitle}>Add Comment</Text>
          </View>
          <View style={[styles.modalBody, styles.fieldGap]}>
            <Text style={styles.commentSectionTitle}>
              Add a note or comment about this trip
            </Text>
            <TextInput
              style={styles.input}
              placeholder={'Add Comment'}
              placeholderTextColor={black}
            />
          </View>
          <View style={styles.modalFooter}>
            <PrimaryGradientButton
              text={'Add'}
              buttonStyle={styles.addButton}
              textStyle={styles.addTextStyle}
            />
            <SecondaryButton
              text={'Cancel'}
              textStyle={styles.cancelTextStyle}
              buttonStyle={styles.cancelButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;
