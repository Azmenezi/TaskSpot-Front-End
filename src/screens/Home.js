import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCategories } from "../apis/category";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const insets = useSafeAreaInsets();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  console.log(categories);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
      }}
    >
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {categories?.map((category) => (
          <View style={{ padding: 16, width: "50%" }}>
            <TouchableOpacity
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
      </View>
    </ScrollView>
  );
};

export default Home;
