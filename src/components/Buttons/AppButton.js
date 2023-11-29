import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import { COLORS, FONT } from "../../constants/themes";

export default function AppButton({
  title,
  onPress,
  color = "primary",
  style,
}) {
  return (
    <View style={{ paddingHorizontal: hp(5) }}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor: COLORS[color] }, style]}
      >
        <Text style={[styles.buttonText]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: hp(2),
    marginVertical: hp(1),
  },
  buttonText: {
    // textTransform: "uppercase",
    fontSize: hp(2),
    fontFamily: FONT.medium,
    color: COLORS.white,
  },
});
