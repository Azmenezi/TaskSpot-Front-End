import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

export default function MyTasks({ route }) {
  const { tasks: initialTasks, categories } = route.params;
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTaskDone = (id) => {
    const updatedTasks = tasks.map((task) =>
      task._id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task._id !== id);
    setTasks(updatedTasks);
  };

  const bulkDeleteDoneTasks = () => {
    const updatedTasks = tasks.filter((task) => !task.done);
    setTasks(updatedTasks);
  };
  const groupTasksByCategory = (tasks, categories) => {
    const categoryMap = categories.reduce((acc, category) => {
      acc[category._id] = { ...category, tasks: [] };
      return acc;
    }, {});

    tasks.forEach((task) => {
      if (categoryMap[task.category]) {
        categoryMap[task.category].tasks.push(task);
      }
    });

    return Object.values(categoryMap); // Convert to array for easier rendering
  };
  const renderItem = ({ item: category }) => (
    <View>
      <Text style={styles.categoryTitle}>{category.name}</Text>
      {category?.tasks?.map((task) => (
        <View key={task._id} style={styles.taskContainer}>
          <Text
            style={{ textDecorationLine: task.done ? "line-through" : "none" }}
          >
            {task.text} (Qty: {task.amount})
          </Text>
          <View style={styles.buttonsContainer}>
            <Button
              title="Toggle Done"
              onPress={() => toggleTaskDone(task._id)}
            />
            <Button
              title="Delete"
              onPress={() => deleteTask(task._id)}
              color="red"
            />
          </View>
        </View>
      ))}
    </View>
  );
  const groupedTasks = groupTasksByCategory(tasks, categories);

  return (
    <View style={styles.container}>
      <Text>MyTasks</Text>
      <FlatList
        data={groupedTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity
        style={styles.bulkDeleteButton}
        onPress={bulkDeleteDoneTasks}
      >
        <Text style={styles.bulkDeleteButtonText}>Bulk Delete Done Tasks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    marginTop: 20,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 160,
  },
  bulkDeleteButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  bulkDeleteButtonText: {
    color: "white",
    textAlign: "center",
  },
});
