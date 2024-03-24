import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  bulkDeleteTasks,
  getTasksByCategory,
  markTasksAsDone,
  markUndoneTasks,
} from "../../apis/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";

export default function CategoryTasks({ route }) {
  const { category } = route.params;
  const [tasks, setTasks] = useState([]);
  const [hideDeleted, setHideDeleted] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState([]);
  const [markedDone, setMarkedDone] = useState([]);
  const [markedUndone, setMarkedUndone] = useState([]);

  // Inside your component
  const hideDeletedRef = useRef(hideDeleted);
  const markedDoneRef = useRef(markedDone);
  const markedUndoneRef = useRef(markedUndone);

  useEffect(() => {
    markedUndoneRef.current = markedUndone;
  }, [markedUndone]);

  // Update refs whenever the values change
  useEffect(() => {
    hideDeletedRef.current = hideDeleted;
  }, [hideDeleted]);

  useEffect(() => {
    markedDoneRef.current = markedDone;
  }, [markedDone]);

  const { data: initialTasks } = useQuery({
    queryKey: ["tasks", category],
    queryFn: () => getTasksByCategory(category),
  });

  const { mutate: markTasksDone } = useMutation({
    mutationKey: ["mark tasks done"],
    mutationFn: () => markTasksAsDone(markedDoneRef.current),
    onSuccess: () => {
      // Clear the markedDone state after successful mutation
      setMarkedDone([]);
    },
  });

  const { mutate: markUndone } = useMutation({
    mutationKey: ["mark tasks undone"],
    mutationFn: () => markUndoneTasks(markedUndoneRef.current),
    onSuccess: () => {
      // Clear the markedUndone state after successful mutation
      setMarkedUndone([]);
    },
  });

  const { mutate: deleteTasks } = useMutation({
    mutationKey: ["delete tasks"],
    mutationFn: () => bulkDeleteTasks(toBeDeleted),
    onSuccess: () => {},
  });

  useEffect(() => {
    return () => {
      if (hideDeletedRef.current) {
        deleteTasks();
      }
      if (markedDoneRef.current.length > 0) {
        markTasksDone();
      }
      if (markedUndoneRef.current.length > 0) {
        markUndone(); // Call the mutation for marking tasks as undone
      }
    };
  }, []);

  useEffect(() => {
    setTasks(initialTasks?.sort((a, b) => a.done - b.done));
  }, [initialTasks]);
  const toggleTaskDone = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === id) {
        return { ...task, done: !task.done };
      }
      return task;
    });

    setTasks(updatedTasks);

    // Handling marking as done or undoing
    if (updatedTasks.find((task) => task._id === id).done) {
      setMarkedDone((prev) => [...prev, id]);
      setMarkedUndone((prev) => prev.filter((taskId) => taskId !== id));
    } else {
      setMarkedUndone((prev) => [...prev, id]);
      setMarkedDone((prev) => prev.filter((taskId) => taskId !== id));
    }
  };

  const bulkDeleteDoneTasks = () => {
    setHideDeleted(true);
    setToBeDeleted(tasks.filter((task) => task.done).map((task) => task._id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        toggleTaskDone(item._id);
      }}
      style={[
        styles.taskContainer,
        { backgroundColor: item.done ? "#cccccc40" : "#ffffff10" },
      ]}
    >
      <Text>
        {item.text} (Qty: {item.amount})
      </Text>
      <View style={styles.buttonsContainer}>
        <View>
          <FontAwesome
            name={item.done ? "square" : "square-o"}
            size={24}
            color="black"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hideDeleted ? tasks.filter((task) => !task.done) : tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />

      {hideDeleted ? (
        <TouchableOpacity
          style={[styles.bulkDeleteButton, { backgroundColor: "green" }]}
          onPress={() => setHideDeleted(false)}
        >
          <Text style={styles.bulkDeleteButtonText}>Undo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.bulkDeleteButton}
          onPress={bulkDeleteDoneTasks}
        >
          <Text style={styles.bulkDeleteButtonText}>
            Bulk Delete Done Tasks
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
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
