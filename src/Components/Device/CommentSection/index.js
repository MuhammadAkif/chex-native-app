import React from 'react';
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

const CommentSection = ({onAddCommentsPress = fallBack, comment = ''}) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Comment</Text>
        <IconLabel
          label={'Add Comments'}
          IconName={Plus}
          IconHeight={hp('3%')}
          IconWidth={wp('4%')}
          onPress={onAddCommentsPress}
        />
      </View>
      {comment && (
        <View style={styles.commentBox}>
          <ScrollView>
            <Text style={styles.comment}>{comment}</Text>
          </ScrollView>
          <Text style={styles.time}>10:30 AM</Text>
        </View>
      )}
      <CommentModal />
    </View>
  );
};

export default CommentSection;
