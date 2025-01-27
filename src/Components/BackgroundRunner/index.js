import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  StatusBar,
} from 'react-native';

import {Header} from 'react-native/Libraries/NewAppScreen';

import BackgroundFetch from 'react-native-background-fetch';
import {styles} from './styles';

const BackgroundRunner = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    initBackgroundFetch().then();
  }, []);

  // BackgroundFetch event handler.
  const onEvent = async taskId => {
    console.log('[BackgroundFetch] task: ', taskId);
    // Do your background work...
    await addEvent(taskId);
    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish(taskId);
  };

  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
  const onTimeout = async taskId => {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    BackgroundFetch.finish(taskId);
  };
  async function initBackgroundFetch() {
    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure(
      {minimumFetchInterval: 15},
      onEvent,
      onTimeout,
    );

    console.log('[BackgroundFetch] configure status: ', status);
  }

  // Add a BackgroundFetch event to <FlatList>
  async function addEvent(taskId) {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise(resolve => {
      setEvents(state => ({
        events: [
          ...state.events,
          {
            taskId: taskId,
            timestamp: new Date().toString(),
          },
        ],
      }));
      resolve();
    });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>BackgroundFetch Demo</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.sectionContainer}>
          <FlatList
            data={events}
            renderItem={({item}) => (
              <Text>
                [{item.taskId}]: {item.timestamp}
              </Text>
            )}
            keyExtractor={item => item.timestamp}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default BackgroundRunner;
