import React, {useEffect, useState} from 'react';
import {Modal, Platform, Text, TextInput, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import styles from './styles';
import {CommentIcon} from '../../../Assets/Icons';
import {colors} from '../../../Assets/Styles';
import {PrimaryGradientButton, SecondaryButton} from '../../index';
import {Platforms} from '../../../Constants';
import {fallBack} from '../../../Utils';

const {royalBlue, black} = colors;
const {OS} = Platform;
const {IOS} = Platforms;

const CommentModal = ({
  isVisible = true,
  comment = '',
  onCancelPress = fallBack,
  onAddPress = fallBack,
}) => {
  const [commentModalState, setCommentModalState] = useState({
    isVisible: true,
    comment: '',
  });

  useEffect(() => {
    if (commentModalState?.isVisible !== isVisible) {
      setCommentModalState(prevState => ({
        ...prevState,
        isVisible: isVisible,
        comment: comment || '',
      }));
    }
  }, [isVisible, comment]);

  const handleCommentChange = text => {
    setCommentModalState({...commentModalState, comment: text});
  };

  const handleAddCommentPress = () => {
    setCommentModalState({...commentModalState, isVisible: false});
    onAddPress(commentModalState?.comment?.trim());
  };
  const handleCancelCommentPress = () => {
    setCommentModalState({...commentModalState, isVisible: false});
    onCancelPress();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={commentModalState?.isVisible}>
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
            <View style={styles.statusDescriptionContainer}>
              <TextInput
                style={[styles.text, OS === IOS && styles.iOSStyle]}
                multiline={true}
                placeholder={'Add Comment'}
                value={commentModalState?.comment}
                placeholderTextColor={black}
                onChangeText={handleCommentChange}
              />
            </View>
          </View>
          <View style={styles.modalFooter}>
            <PrimaryGradientButton
              text={'Add'}
              buttonStyle={styles.addButton}
              textStyle={styles.addTextStyle}
              onPress={handleAddCommentPress}
            />
            <SecondaryButton
              text={'Cancel'}
              textStyle={styles.cancelTextStyle}
              buttonStyle={styles.cancelButton}
              onPress={handleCancelCommentPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;
