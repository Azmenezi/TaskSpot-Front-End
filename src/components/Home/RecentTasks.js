import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ROUTES from "../../navigations";

export default function RecentTasks({ tasks, navigation, categories }) {
  return (
    <>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 24 }}>Recent Tasks</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTES.HEDERROUTES.HOME.MY_TASKS, {
              tasks,
              categories,
            })
          }
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "blue" }}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {tasks?.slice(0, 5)?.map((task) => (
          <View style={{ width: 200 }} key={task._id}>
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
              <Text style={{ fontSize: 20 }}>{task?.text}</Text>
              <Text style={{ fontSize: 20 }}>amount: {task?.amount}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
