import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ROUTES from "../../navigations";
import { COLORS } from "../../constants/themes";

export default function HorizintalCategories({ categories, navigation }) {
  return (
    <>
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Text
          style={{ fontSize: 20, fontWeight: "600", color: COLORS.whiteText }}
        >
          Categories
        </Text>
      </View>
      <ScrollView
        horizontal={true}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {categories?.map((category) => (
          <TouchableOpacity
            key={category._id}
            onPress={() =>
              navigation.navigate(
                ROUTES.HEDERROUTES.RIGHT_STACK.CATEGORY_TASKS,
                {
                  category: category.name,
                }
              )
            }
            style={{
              width: 130,
              height: 120,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "gray",
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
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
