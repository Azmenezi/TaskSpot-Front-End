import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LeftScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,

        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Text>LeftScreen</Text>
    </ScrollView>
  );
};

export default LeftScreen;
