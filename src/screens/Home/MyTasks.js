import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  bulkDeleteTasks,
  markTasksAsDone,
  markUndoneTasks,
} from "../../apis/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesome, FontAwesome5, Feather, Entypo } from "@expo/vector-icons";
import Header from "../../components/Header/Header";

export default function MyTasks({ route, navigation }) {
  const { tasks: initialTasks, categories } = route.params;
  const [tasks, setTasks] = useState(initialTasks);
  const [hideDeleted, setHideDeleted] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState([]);
  const [markedDone, setMarkedDone] = useState([]);
  const [markedUndone, setMarkedUndone] = useState([]);

  // Initialize all categories as visible (or hidden if you prefer)
  const [hiddenCategories, setHiddenCategories] = useState(() =>
    categories.reduce((acc, category) => {
      acc[category._id] = false; // Set to true if you want all categories to be initially hidden
      return acc;
    }, {})
  );

  const queryClient = useQueryClient();
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

  const { mutate: markTasksDone } = useMutation({
    mutationKey: ["mark tasks done"],
    mutationFn: () => markTasksAsDone(markedDoneRef.current),
    onSuccess: () => {
      // Clear the markedDone state after successful mutation
      setMarkedDone([]);
      return queryClient.invalidateQueries({ queryKey: ["my tasks"] });
    },
  });

  const { mutate: markUndone } = useMutation({
    mutationKey: ["mark tasks undone"],
    mutationFn: () => markUndoneTasks(markedUndoneRef.current),
    onSuccess: () => {
      // Clear the markedUndone state after successful mutation
      setMarkedUndone([]);
      return queryClient.invalidateQueries({ queryKey: ["my tasks"] });
    },
  });

  const { mutate: deleteTasks } = useMutation({
    mutationKey: ["delete tasks"],
    mutationFn: () => bulkDeleteTasks(toBeDeleted),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["my tasks"] });
    },
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

  const toggleCategoryVisibility = (categoryId) => {
    setHiddenCategories((prevHiddenCategories) => ({
      ...prevHiddenCategories,
      [categoryId]: !prevHiddenCategories[categoryId],
    }));
  };

  const renderItem = ({ item: category }) => (
    <View style={{ paddingVertical: 10 }}>
      <Pressable
        onPress={() => toggleCategoryVisibility(category._id)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          paddingVertical: 16,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: -6,
            height: 8,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          elevation: 5,
          backgroundColor: "#52374a",
          width: "70%",
        }}
      >
        <Text style={{ fontSize: 20, color: "white", fontWeight: "600" }}>
          {category.name}
        </Text>
        <Entypo
          name={
            hiddenCategories[category._id] ? "chevron-right" : "chevron-down"
          }
          size={24}
          color="white"
        />
      </Pressable>

      {!hiddenCategories[category._id] &&
        category?.tasks?.map((item) => (
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
        ))}
    </View>
  );
  const groupedTasks = groupTasksByCategory(tasks, categories);

  return (
    <>
      <Header>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingBottom: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              borderRadius: 500,
              borderWidth: 3,
              padding: 6,
            }}
          >
            <Entypo name="chevron-left" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </Header>
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          data={
            hideDeleted
              ? groupedTasks.filter((category) =>
                  category.tasks.some((task) => !task.done)
                )
              : groupedTasks.filter((category) => category.tasks.length > 0)
          }
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
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
    </>
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
