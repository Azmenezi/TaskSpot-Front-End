import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCategories } from "../apis/category";

const Home = () => {
  const insets = useSafeAreaInsets();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
      }}
    >
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24 }}>Categories</Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          flexDirection: "row",
          gap: 8,
        }}
      >
        {categories?.map((category) => (
          <View style={{ width: 200 }}>
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
      </ScrollView>
    </ScrollView>
  );
};

export default Home;
