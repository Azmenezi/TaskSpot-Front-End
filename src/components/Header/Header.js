import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header({ children }) {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingTop: insets.top }}>{children}</View>;
}

const styles = StyleSheet.create({});
