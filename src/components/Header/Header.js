import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
export default function Header({ children, back = false, right = null }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingBottom: 6,
        }}
      >
        {back && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: "20%",
              borderRadius: 500,
              borderWidth: 3,
              padding: 6,
            }}
          >
            <Entypo name="chevron-left" size={30} color="black" />
          </TouchableOpacity>
        )}
        <View
          style={{
            width: "60%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </View>
        <View style={{ width: "20%" }}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
