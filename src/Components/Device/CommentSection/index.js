import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IconLabel} from '../../index';
import {Plus} from '../../../Assets/Icons';
import {fallBack} from '../../../Utils';
import styles from './styles';
import CommentModal from './CommentModal';
import {useDeviceActions, useDeviceState} from '../../../hooks/device';
import {format12HourTime} from '../../../Utils/helpers';
import {setCommentAPI} from '../../../services/device';

const CommentSection = ({
  onAddCommentsPress = fallBack,
  comment = '',
  time = null,
  onCancelPress = fallBack,
}) => {
  const {trip, userStartTripDetails} = useDeviceState();
  const {setComment} = useDeviceActions();
  const [commentSectionState, setCommentSectionState] = useState({
    isVisible: false,
    comment: '',
    time: null,
  });

  const handleCommentModalPress = () => {
    setCommentSectionState(prevState => ({...prevState, isVisible: true}));
    onAddCommentsPress();
  };

  const handleAddPress = async comment => {
    setCommentSectionState(prevState => ({...prevState, isVisible: false}));
    if (comment !== trip?.comment) {
      const time = Date.now();
      const commentInfo = {comment: comment, time: format12HourTime(time)};

      try {
        setComment(commentInfo);
        if (userStartTripDetails?.id) {
          const {data} = await setCommentAPI(userStartTripDetails?.id, comment);
          console.log('trip comment response : ', data);
        }
        onAddCommentsPress();
      } catch (error) {
        setComment('');
        throw error;
      }
    }
  };

  const handleCancelPress = () => {
    setCommentSectionState(prevState => ({...prevState, isVisible: false}));
    onCancelPress();
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Comment</Text>
        <IconLabel
          label={'Add Comments'}
          IconName={Plus}
          IconHeight={hp('3%')}
          IconWidth={wp('4%')}
          onPress={handleCommentModalPress}
        />
      </View>
      {comment && (
        <View style={styles.commentBox}>
          <ScrollView>
            <Text style={styles.comment}>{comment}</Text>
          </ScrollView>
          <Text style={styles.time}>{time}</Text>
        </View>
      )}
      <CommentModal
        isVisible={commentSectionState.isVisible}
        onCancelPress={handleCancelPress}
        onAddPress={handleAddPress}
        comment={trip?.commentInfo?.comment || ''}
      />
    </View>
  );
};

export default CommentSection;
