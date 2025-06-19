import React from 'react';
import {View, StyleSheet} from 'react-native';

import ActivityRecognitionCard from '../Components/ActivityRecognitionCard';
import {colors} from '../Assets/Styles';

const ActivityRecognitionScreen: React.FC = () => {
  const onActivityChange = (activity: any) => {
    console.log('Activity changed:', activity);
  };

  return (
    <View style={styles.container}>
      <ActivityRecognitionCard
        onActivityChange={onActivityChange}
        showLog={true}
        maxLogItems={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default ActivityRecognitionScreen;
