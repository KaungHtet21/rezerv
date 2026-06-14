import { Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useColors } from "~core/design";

const ShimmerPlaceholder = ({ style }: { style: any }) => {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: colors.border,
          opacity: fadeAnim,
        },
      ]}
    />
  );
};

export default ShimmerPlaceholder;
