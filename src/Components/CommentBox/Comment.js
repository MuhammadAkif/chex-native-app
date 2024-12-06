import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';
import {useBoolean} from '../../hooks';
import {CommentBox, CommentButton} from '../index';
import {useDispatch, useSelector} from 'react-redux';
import {setFeedback} from '../../Store/Actions';

const {cobaltBlueTwo} = colors;

const Comment = () => {
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
      <CommentButton onPress={onPress} />
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
});

export default Comment;
