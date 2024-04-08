import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCategories } from "../../apis/category";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import ROUTES from "../../navigations";
import { COLORS } from "../../constants/themes";

const MiddleScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={{ padding: 16, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            textAlign: "center",
            color: COLORS.whiteText,
          }}
        >
          Choose a category
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            textAlign: "center",
            color: COLORS.whiteText,
          }}
        >
          to add a task to
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        {categories?.map((category) => (
          <View key={category._id} style={{ padding: 8, width: "50%" }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  ROUTES.HEDERROUTES.MIDDLE_STACK.CREATE_TASK,
                  { category }
                );
              }}
              style={{
                width: "100%",
                height: 120,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "lightgray",
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <View style={{ position: "absolute" }}>
                <Ionicons
                  name={category?.icon}
                  size={40}
                  color={COLORS.behindItem}
                />
              </View>
              <View style={{ position: "absolute", bottom: 10, left: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>
                  {category?.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MiddleScreen;
