import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import { showMessage } from "react-native-flash-message";

const TimerNotification = ({ place, tasks }) => {
  console.log("TimerNotification");
  const [lastNotification, setLastNotification] = useState({
    place: null,
    category: null,
    time: null,
  });

  useEffect(() => {
    const askNotification = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted")
        console.log("Notification permissions granted.");
    };

    askNotification();

    const listener = Notifications.addNotificationReceivedListener(() => {
      showMessage({
        message: "TaskSpot Notification",
        description: `You may find ${
          tasks.filter((task) => task.category === place.category._id)[0]?.text
        } at ${place.name}`,
        type: "info",
        icon: "info",
      });
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    const now = new Date();
    console.log(
      tasks.filter((task) => task.category == place.category._id).length
    );

    // Check if the place is the same as the last place we notified about, or
    // if the current place's category is the same as the last one and it has been less than an hour
    if (
      (place === lastNotification.place &&
        (place.category === lastNotification.category ||
          now - lastNotification.time > 3600000)) ||
      tasks.filter((task) => task.category === place.category._id).length === 0
    )
      return;

    const schedulingOptions = {
      content: {
        title: "TaskSpot Notification",
        body: `You may find ${
          tasks.filter((task) => task.category === place.category._id)[0]?.text
        } at ${place.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: "blue",
      },
      trigger: {
        seconds: 5,
      },
    };

    Notifications.scheduleNotificationAsync(schedulingOptions);
    setLastNotification({ place, category: place.category, time: now });
  }, [place]);

  return <View />;
};

export default TimerNotification;
