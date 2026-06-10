import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CText } from "~app/common";
import { duration } from "~core/design/animation";
import { useNetworkStatus } from "~core/hooks";

const BANNER_HEIGHT = 36;

const NetworkBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { showReconnected, visible } = useNetworkStatus();
  const translateY = useSharedValue(-(BANNER_HEIGHT + insets.top));

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : -(BANNER_HEIGHT + insets.top), {
      duration: duration.normal,
    });
  }, [visible, insets.top, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backgroundColor = showReconnected ? "#1B7A3D" : "#242526";
  const message = showReconnected ? "Back online" : "No internet connection";
  const iconName = showReconnected ? "wifi" : "cloud-offline-outline";

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name={iconName} size={16} color="#FFFFFF" />
      <CText variant="label" weight="medium" color="#FFFFFF">
        {message}
      </CText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    minHeight: BANNER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});

export default React.memo(NetworkBanner);
