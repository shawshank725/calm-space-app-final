import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');

const BUBBLE_CONFIGS = Array.from({ length: 14 }).map((_, i) => {
  const size = Math.floor(Math.random() * 90) + 40;
  return {
    size,
    left: Math.random() * 90,
    delay: Math.random() * 4000,
    duration: 18000 + Math.random() * 10000,
    color: [
      'rgba(206,147,216,0.30)',
      'rgba(186,104,200,0.25)',
      'rgba(142,36,170,0.22)',
      'rgba(225,190,231,0.28)'
    ][i % 4],
    opacity: 0.35 + Math.random() * 0.25
  };
});

const Bubble = ({ cfg }: { cfg: typeof BUBBLE_CONFIGS[0] }) => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: (1 - progress.value) * (screenHeight + cfg.size) - cfg.size },
        { scale: 0.6 + (progress.value * 0.5) }
      ],
    };
  });

  useEffect(() => {
    progress.value = withDelay(
      cfg.delay,
      withRepeat(
        withTiming(1, {
          duration: cfg.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [cfg.delay, cfg.duration, progress]);

  return (
    <Reanimated.View
      style={[
        {
          position: 'absolute',
          left: `${cfg.left}%`,
          width: cfg.size,
          height: cfg.size,
          borderRadius: cfg.size / 2,
          backgroundColor: cfg.color,
          opacity: cfg.opacity,
        },
        animatedStyle
      ]}
    />
  );
};

export const AnimatedBackground = () => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }} pointerEvents="none">
      {BUBBLE_CONFIGS.map((cfg, i) => (
        <Bubble key={i} cfg={cfg} />
      ))}
    </View>
  );
};
