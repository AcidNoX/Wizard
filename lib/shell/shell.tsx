import { useCallback, useEffect, useState } from "react";
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShellProvider } from "./shell.context";
import { useShellStore } from "./useShellStore";

const bez = Easing.bezier(0.25, 0.1, 0.25, 1.0);
const ANIMATION_DURATION = 200;

const timingConfig: WithTimingConfig = {
  duration: ANIMATION_DURATION,
  easing: bez,
};

// Get initial translateY value that ensures modal starts off-screen
const getInitialTranslateY = () => Dimensions.get("window").height;

export const Shell = () => {
  const shell = useShellStore((x) => x.shell);

  if (!shell) return;

  return <ShellInner key={shell.id} shell={shell} />;
};

const ShellInner = ({
  shell,
}: {
  shell: { id: string; Element: React.ReactNode };
}) => {
  const safe = useSafeAreaInsets();
  const { closeShell } = useShellStore();
  const [hasInitialHeight, setHasInitialHeight] = useState(false);

  // Shared values for animations
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(getInitialTranslateY());
  const height = useSharedValue(0);

  // Handle content measurement
  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const newHeight = Math.round(e.nativeEvent.layout.height);
      if (!hasInitialHeight) {
        height.set(newHeight);
        setHasInitialHeight(true);
      } else {
        height.set(withTiming(newHeight, timingConfig));
      }
    },
    [hasInitialHeight]
  );

  // Animate in on mount
  useEffect(() => {
    if (!hasInitialHeight) return;

    opacity.set(withTiming(1, timingConfig));
    translateY.set(height.get() + 32);
    translateY.set(withTiming(0, timingConfig));
  }, [hasInitialHeight]);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
    height: height.get(),
  }));

  // Handle close animation
  const handleClose = useCallback(() => {
    opacity.set(withTiming(0, timingConfig));
    translateY.set(
      withTiming(height.get() + 32, timingConfig, () => {
        runOnJS(closeShell)();
      })
    );
  }, [closeShell]);

  return (
    <>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        onTouchEnd={handleClose}
      />
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            marginBottom: safe.bottom + 16,
          },
        ]}
      >
        <View style={styles.inner} onLayout={onContentLayout}>
          <ShellProvider value={{ closeShell: handleClose }}>
            {shell.Element}
          </ShellProvider>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    margin: 16,
    borderRadius: 16,
    backgroundColor: "white",
    overflow: "hidden",
    elevation: 5,
  },
  inner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
