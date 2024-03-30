import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HorizintalCategories from "../components/Home/HorizontalScrollview";
import RecentTasks from "../components/Home/RecentTasks";
import { getCategories } from "../apis/category";
import { getMyTasks } from "../apis/tasks";
import { useQuery } from "@tanstack/react-query";

const RightScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: myTasks } = useQuery({
    queryKey: ["my tasks"],
    queryFn: () => getMyTasks(),
  });
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <HorizintalCategories categories={categories} navigation={navigation} />
      <RecentTasks
        categories={categories}
        tasks={myTasks}
        navigation={navigation}
      />
    </ScrollView>
  );
};

export default RightScreen;
