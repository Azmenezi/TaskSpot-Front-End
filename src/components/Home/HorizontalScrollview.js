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

export default function HorizintalCategories({ categories, navigation }) {
  return (
    <>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24 }}>Categories</Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {categories?.map((category) => (
          <View style={{ width: 200 }} key={category._id}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.HEDERROUTES.HOME.CATEGORY_TASKS, {
                  category: category.name,
                })
              }
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "gray",
                borderRadius: 12,
                padding: 20,
                gap: 4,
              }}
            >
              <Ionicons name={category?.icon} size={40} color="black" />
              <Text style={{ fontSize: 20 }}>{category?.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
