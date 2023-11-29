import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, View } from "react-native";

const Skeleton = ({ width, height }) => {
  const shimmerAnimation = new Animated.Value(0);

  const startShimmering = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  startShimmering();

  return (
    <View
      style={{ width, height, overflow: "hidden", backgroundColor: "#e0e0e0" }}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "#f0f0f0",
          borderRadius: 20,
          transform: [
            {
              translateX: shimmerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-width, width * 2],
              }),
            },
          ],
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.5)",
            "rgba(255, 255, 255, 1)",
            "rgba(255, 255, 255, 0.5)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;
