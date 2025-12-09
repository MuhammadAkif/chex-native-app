import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Pressable, StatusBar, Platform} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

// Optional: if you have react-native-video installed you can enable real video playback
// import Video from 'react-native-video';

/*
  TikTok For-You Page — Single-file example (Reanimated v3)

  Features:
  - Vertical pager with snapping (pan gesture + spring)
  - Per-card parallax & interpolate effects
  - Double-tap to like with heart pop animation
  - Play/pause simulation (works without react-native-video)
  - Top progress bar per item
  - Like/comment/action column

  How it works (high-level):
  - We render all items absolutely positioned.
  - A shared `index` value controls which item is centered.
  - The pan gesture modifies a `translateY` shared value and at end we spring to nearest index.
  - Each card's animated style is computed from (index + gesture) to create smooth transitions.

  Notes:
  - This file is written for clarity & deliverability. In production you should split components into separate files.
  - Requires: react-native-reanimated v3, react-native-gesture-handler. react-native-video is optional.
*/

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const VISIBLE_ITEMS = 3; // we render a few items around active index

const DATA = Array.from({length: 7}).map((_, i) => ({
  id: `item-${i}`,
  title: `Cool video ${i + 1}`,
  subtitle: `Creator ${i + 1}`,
  // replace with real remote video urls if you have them
  poster: `https://picsum.photos/seed/${i + 1}/720/1280`,
}));

export default function TikTokForYouExample() {
  const index = useSharedValue(0); // active index
  const translateY = useSharedValue(0); // gesture translation
  const isDragging = useSharedValue(false);

  // For accessibility / JS-side state
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  // convert to JS when index changes
  useDerivedValue(() => {
    runOnJS(setActive)(index.value);
  });

  // Vertical pan gesture
  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate(e => {
      translateY.value = e.translationY;
    })
    .onEnd(e => {
      isDragging.value = false;
      const change = -Math.round((translateY.value + e.velocityY * 0.05) / SCREEN_HEIGHT);
      let next = index.value + change;
      // clamp
      next = Math.max(0, Math.min(DATA.length - 1, next));
      // reset translation and spring index
      translateY.value = withTiming(0, {duration: 160});
      index.value = withSpring(next, {damping: 50, stiffness: 120});
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <StatusBar hidden />

        {DATA.map((item, i) => (
          <VideoCard key={item.id} item={item} idx={i} index={index} translateY={translateY} />
        ))}

        {/* Simple UI footer showing index */}
        <View style={styles.footerOverlay} pointerEvents="none">
          <Text style={styles.footerText}>
            {active + 1} / {DATA.length}
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
}

// If you have these from module scope remove these two lines and rely on outer values.

function VideoCard({item, idx, index, translateY}) {
  const [liked, setLiked] = useState(false);

  const progress = useSharedValue(0);
  const playing = useSharedValue(0);
  const heartScale = useSharedValue(0);

  // derived offset on UI thread
  const cardOffset = useDerivedValue(() => {
    return (idx - index.value) * SCREEN_HEIGHT + translateY.value;
  });

  // whole-card animated style
  const cardStyle = useAnimatedStyle(() => {
    const offset = cardOffset.value;
    const t = interpolate(offset, [-SCREEN_HEIGHT, 0, SCREEN_HEIGHT], [-1, 0, 1], Extrapolation.CLAMP);

    const translate = offset;
    const scale = interpolate(Math.abs(t), [0, 1], [1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(Math.abs(t), [0, 1], [1, 0.6], Extrapolation.CLAMP);

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      transform: [{translateY: translate}, {scale}],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  // poster parallax: apply to an Animated.View wrapper (not Animated.Image)
  const posterWrapperStyle = useAnimatedStyle(() => {
    const offset = cardOffset.value;
    const parallax = interpolate(offset, [-SCREEN_HEIGHT, 0, SCREEN_HEIGHT], [-40, 0, 40], Extrapolation.CLAMP);
    return {
      transform: [{translateY: parallax}],
    };
  });

  // heart animation style
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{scale: heartScale.value}],
    opacity: heartScale.value > 0 ? 1 : 0,
  }));

  // top progress fill style
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  // auto-play / progress management on UI thread
  useDerivedValue(() => {
    if (Math.round(index.value) === idx) {
      playing.value = 1;
      // simulate 6s playback
      progress.value = withTiming(1, {duration: 6000}, finished => {
        if (finished && Math.round(index.value) === idx) {
          // advance to next on UI thread
          const next = Math.min(DATA.length - 1, Math.round(index.value) + 1);
          index.value = withSpring(next, {damping: 22, stiffness: 160});
        }
      });
    } else {
      // pause & reset quickly
      playing.value = 0;
      progress.value = withTiming(0, {duration: 180});
    }
  });

  // gestures
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      heartScale.value = withTiming(1.6, {duration: 160}, () => {
        heartScale.value = withTiming(0, {duration: 260});
      });
      if (Math.round(index.value) === idx) {
        // run JS update for liked state
        runOnJS(setLiked)(v => !v);
      }
    });

  const singleTap = Gesture.Tap().onStart(() => {
    if (Math.round(index.value) === idx) {
      if (playing.value === 1) {
        playing.value = 0;
        // pause: keep progress as-is (no seeking)
      } else {
        playing.value = 1;
        const remaining = Math.max(100, 6000 * (1 - progress.value));
        progress.value = withTiming(1, {duration: remaining});
      }
    }
  });

  const gesture = Gesture.Exclusive(doubleTap, singleTap);

  return (
    <GestureDetector key={item.id} gesture={gesture}>
      <Animated.View style={cardStyle}>
        {/* Poster wrapper is animated; the Image inside is a normal RN Image */}
        <Animated.View style={[{width: SCREEN_WIDTH, height: SCREEN_HEIGHT, overflow: 'hidden'}, posterWrapperStyle]}>
          <Image source={{uri: item.poster}} style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover'}} />
        </Animated.View>

        {/* Overlay meta */}
        <View style={styles.metaContainer} pointerEvents="none">
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>@{item.subtitle}</Text>
        </View>

        {/* Right action bar */}
        <View style={styles.actionBar} pointerEvents="box-none">
          <Pressable onPress={() => setLiked(v => !v)}>
            <View style={styles.actionButton}>
              <Text style={styles.actionText}>{liked ? '♥' : '♡'}</Text>
            </View>
          </Pressable>
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>💬</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>↗</Text>
          </View>
        </View>

        {/* Center heart */}
        <Animated.View style={[styles.centerHeart, heartStyle]} pointerEvents="none">
          <Text style={styles.heartText}>❤</Text>
        </Animated.View>

        {/* Top progress */}
        <View style={styles.topProgressBackground} pointerEvents="none">
          <Animated.View style={[styles.topProgressFill, progressStyle]} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  poster: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  metaContainer: {
    position: 'absolute',
    left: 16,
    bottom: 80,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#ddd',
    fontSize: 14,
  },
  actionBar: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    gap: 18,
  },
  actionButton: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  actionText: {
    color: '#fff',
    fontSize: 20,
  },
  centerHeart: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 48,
    top: SCREEN_HEIGHT / 2 - 48,
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartText: {
    fontSize: 56,
    color: '#fff',
    textShadowColor: '#ff3b30',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 8,
  },
  topProgressBackground: {
    position: 'absolute',
    top: Platform.select({ios: 44, android: StatusBar.currentHeight || 24}),
    left: 16,
    right: 16,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topProgressFill: {
    height: 4,
    backgroundColor: '#fff',
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  footerText: {color: '#fff', opacity: 0.9},
});
