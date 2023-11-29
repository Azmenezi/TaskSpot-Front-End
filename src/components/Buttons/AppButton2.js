import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../constants/themes";

const AppButton2 = ({
  title,
  onPress,
  color = "primary",
  backgroundColor = COLORS.primary,
}) => {
  return (
    <View style={{ paddingHorizontal: hp(5) }}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor }]}
      >
        <Text style={[styles.buttonText]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppButton2;

const styles = StyleSheet.create({
  button: {
    width: 350,
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
