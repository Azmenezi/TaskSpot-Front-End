import { Ionicons, Octicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/themes";
import ROUTES from "../../navigations";

export default function RecentTasks({ tasks, navigation, categories }) {
  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 20, fontWeight: "600", color: COLORS.whiteText }}
        >
          Tasks to do{" "}
          <Text style={{ color: "lightgray" }}>• {tasks?.length}</Text>
        </Text>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.HEDERROUTES.MIDDLE_STACK.STACK)
            }
            style={{
              width: 36,
              height: 36,
              backgroundColor: COLORS.gray,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Octicons name="plus" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {tasks.length === 0 ? (
          <View style={{ paddingHorizontal: 16 }}></View>
        ) : (
          <>
            {tasks
              ?.filter((task) => !task.done)
              ?.slice(0, 4)
              ?.map((task) => (
                <View key={task._id}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate(
                        ROUTES.HEDERROUTES.RIGHT_STACK.CATEGORY_TASKS,
                        {
                          category: task.category.name,
                        }
                      )
                    }
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: "15%",
                        padding: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "lightgray",
                          padding: 10,
                          borderRadius: 8,
                          borderWidth: 0.2,
                          borderColor: "gray",
                        }}
                      >
                        <Ionicons
                          name={task.category.icon}
                          size={18}
                          color={COLORS.behindItem}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        borderBottomWidth: 0.2,
                        borderColor: "gray",
                        padding: 4,
                        width: "85%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingRight: 16,
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "500",
                            color: COLORS.whiteText,
                          }}
                        >
                          {task?.text}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "400",
                            color: "lightgray",
                          }}
                        >
                          amount: {task?.amount}
                        </Text>
                      </View>
                      <View>
                        <Ionicons
                          name="chevron-forward"
                          size={24}
                          color={COLORS.whiteText}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              ))}
            <Pressable
              onPress={() =>
                navigation.navigate(ROUTES.HEDERROUTES.RIGHT_STACK.MY_TASKS, {
                  tasks,
                  categories,
                })
              }
              style={{
                justifyContent: "center",
                paddingHorizontal: 16,
                paddingTop: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "teal" }}>
                See All
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
