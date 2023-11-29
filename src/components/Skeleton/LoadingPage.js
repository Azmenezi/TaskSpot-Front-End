import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingPage() {
  return (
    <View
      style={{
        zIndex: 100,
        height: "100%",
        width: "100%",
        position: "absolute",
        backgroundColor: "#00000040",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({});
