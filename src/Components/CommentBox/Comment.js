import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';
import {CommentIcon} from '../../Assets/Icons';
import {useBoolean} from '../../hooks';
import {CommentBox, SecondaryButton} from '../index';
import {useDispatch, useSelector} from 'react-redux';
import {setFeedback} from '../../Store/Actions';

const {white, cobaltBlueTwo} = colors;

const Comment = ({sideIcon = true}) => {
  const dispatch = useDispatch();
  const {feedback} = useSelector(state => state.newInspection);
  const {value: visible, toggle: toggleVisibility} = useBoolean(false);
  const {value: isLoading, toggle: toggleIsLoading} = useBoolean(false);

  const onPress = () => {
    toggleVisibility();
  };

  const onSubmit = text => {
    toggleIsLoading();
    if (feedback !== text.trim()) {
      dispatch(setFeedback(text));
    }
    toggleIsLoading();
    toggleVisibility();
  };

  const onCancel = () => {
    toggleVisibility();
  };

  return (
    <View style={styles.container}>
      {sideIcon ? (
        <TouchableOpacity style={styles.feedbackContainer} onPress={onPress}>
          <CommentIcon height={hp('3%')} width={wp('7%')} color={white} />
        </TouchableOpacity>
      ) : (
        <SecondaryButton
          text={'Add Comment'}
          disabled={isLoading}
          buttonStyle={styles.feedbackButton}
          textStyle={styles.feedbackButtonText}
          onPress={onPress}
        />
      )}
      <CommentBox
        visible={visible}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onCancel}
        feedback={feedback}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  feedbackContainer: {
    padding: wp('3.8%'),
    borderRadius: hp('100%'),
    backgroundColor: cobaltBlueTwo,
  },
  feedbackButton: {
    width: wp('70%'),
    borderRadius: wp('5%'),
    borderColor: cobaltBlueTwo,
  },
  feedbackButtonText: {
    color: cobaltBlueTwo,
  },
});

export default Comment;
