import { Entypo, Fontisto } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addTasks } from "../../apis/tasks";

export default function AddTask({ route, navigation }) {
  const { category } = route.params;
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState([
    { id: 0, text: "", amount: 1, category: category._id },
  ]);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["add task"],
    mutationFn: () => addTasks(tasks),
    onSuccess: () => {
      navigation.pop();
      Alert.alert("Task added successfully");
    },
  });

  const handleChange = (text, index) => {
    const newTasks = [...tasks];
    newTasks[index] = {
      ...newTasks[index],
      text: text,
    };
    setTasks(newTasks);
  };

  const incrementAmount = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index
          ? {
              ...task,
              amount: task.amount < 99 ? task.amount + 1 : task.amount,
            }
          : task
      )
    );
  };

  const decrementAmount = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index
          ? { ...task, amount: task.amount > 1 ? task.amount - 1 : task.amount }
          : task
      )
    );
  };

  const addNewTask = () => {
    setTasks([
      ...tasks,
      { id: tasks.length, text: "", amount: 1, category: category._id },
    ]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSubmit = () => {
    let counter = 0;
    tasks.forEach((task) => task.text.length == 0 && counter++);
    if (counter === 0) {
      return mutate();
    }
    return Alert.alert("please fill all fields");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 100,
        flexGrow: 1,
      }}
    >
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          adding tasks to {category?.name}
        </Text>
      </View>
      {tasks.map((task, index) => (
        <View
          key={task.id}
          style={{ paddingHorizontal: 20, paddingVertical: 6 }}
        >
          <View style={{ flexDirection: "row", gap: "5%" }}>
            <View style={{ width: "65%" }}>
              <TextInput
                style={{
                  borderWidth: 0.2,
                  borderRadius: 12,
                  padding: 12,
                }}
                placeholder="Task text..."
                onChangeText={(text) => handleChange(text, index)}
                value={task.text}
              />
              {!task.id == 0 && (
                <TouchableOpacity
                  style={{ position: "absolute", right: 14, top: 8 }}
                  onPress={() => removeTask(task.id)}
                >
                  <Fontisto name="trash" size={22} color="tomato" />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                width: "35%",
                borderWidth: 0.2,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "33%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => decrementAmount(index)}
              >
                <Text style={{ fontSize: 20 }}>-</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: "33%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16 }}>{task.amount}</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: "33%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => incrementAmount(index)}
              >
                <Text style={{ fontSize: 20 }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={{
          alignItems: "flex-end",
          padding: 20,
        }}
        onPress={addNewTask}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Add a field</Text>
          <Entypo name="squared-plus" size={30} color="green" />
        </View>
      </TouchableOpacity>
      <View style={{ padding: 50 }}>
        <TouchableOpacity
          disabled={isLoading ? true : false}
          onPress={handleSubmit}
          style={{
            backgroundColor: "gray",
            borderWidth: 2,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={24} />
          ) : (
            <Text style={{ fontSize: 20 }}>Create</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
