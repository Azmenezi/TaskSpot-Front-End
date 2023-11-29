import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../constants/themes";

const DisabledButton = ({ title, onPress, color = "primary" }) => {
  return (
    <View style={styles.button}>
      <Text style={[styles.buttonText]}>{title}</Text>
    </View>
  );
};

export default DisabledButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    width: "98%",
    height: 53,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: hp(2),
    marginVertical: hp(1),
    marginHorizontal: hp(2),
  },
  buttonText: {
    // textTransform: "uppercase",
    fontSize: hp(2),
    // fontFamily: FONT.medium,
    color: COLORS.white,
  },
});
