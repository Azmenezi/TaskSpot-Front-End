import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  bulkDeleteTasks,
  getTasksByCategory,
  markTasksAsDone,
  markUndoneTasks,
} from "../../apis/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesome, Feather, FontAwesome5 } from "@expo/vector-icons";

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

  const { data: initialTasks, isLoading } = useQuery({
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
    <View
      style={{
        alignItems: "flex-end",
        justifyContent: "center",
        paddingVertical: 8,
      }}
    >
      <Pressable
        onPress={() => {
          toggleTaskDone(item._id);
        }}
        style={[
          styles.taskContainer,
          {
            backgroundColor: item.done ? "#8e7286" : "#52374a",
            width: item.done ? "70%" : "80%",
          },
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: item.done ? "#baa3a7" : "white",
          }}
        >
          {item.text} (Qty: {item.amount})
        </Text>
        <View style={styles.buttonsContainer}>
          <View>
            <FontAwesome
              name={item.done ? "square" : "square-o"}
              size={24}
              color="white"
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
  if (isLoading)
    return (
      <View
        style={{ flex: 0.9, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  return (
    <View style={styles.container}>
      {tasks?.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            no tasks to do in {category}
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={hideDeleted ? tasks.filter((task) => !task.done) : tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}

      <TouchableOpacity
        style={[
          {
            backgroundColor: "white",
            borderWidth: 3,
            borderColor: "#52374a",
            padding: 10,
            borderRadius: 500,
            position: "absolute",
            bottom: 100,
            left: 20,
          },
          styles.leftShadow,
        ]}
        onPress={
          hideDeleted ? () => setHideDeleted(false) : bulkDeleteDoneTasks
        }
      >
        {hideDeleted ? (
          <FontAwesome5 name="undo-alt" size={24} color="#52374a" />
        ) : (
          <Feather name="trash" size={24} color="#52374a" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",

    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: -6,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bulkDeleteButtonText: {
    color: "white",
    textAlign: "center",
  },
  leftShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: -6,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
