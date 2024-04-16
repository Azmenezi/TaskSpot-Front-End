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
    const now = new Date();
    const askNotification = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted")
        console.log("Notification permissions granted.");
    };

    askNotification();

    const listener = Notifications.addNotificationReceivedListener(() => {
      if (
        place === lastNotification.place ||
        (place.category === lastNotification.category &&
          now - lastNotification.time > 3600000) ||
        tasks.filter((task) => task.category._id === place.category._id)
          .length === 0
      )
        return;

      showMessage({
        message: "TaskSpot Notification",
        description: `You may find ${
          tasks.filter((task) => task.category._id === place.category._id)[0]
            ?.text
        } at ${place.name}`,
        type: "info",
        icon: "info",
      });
      setLastNotification({ place, category: place.category, time: now });
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    const now = new Date();
    console.log(
      tasks.filter((task) => task.category._id == place.category._id).length
    );
    if (
      place === lastNotification.place ||
      (place.category === lastNotification.category &&
        now - lastNotification.time > 3600000) ||
      tasks.filter((task) => task.category._id === place.category._id)
        .length === 0
    )
      return;

    const schedulingOptions = {
      content: {
        title: "TaskSpot Notification",
        body: `You may find ${
          tasks.filter((task) => task.category._id === place.category._id)[0]
            ?.text
        } at ${place.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: "blue",
      },
      trigger: {
        seconds: 1,
      },
    };

    Notifications.scheduleNotificationAsync(schedulingOptions);
    setLastNotification({ place, category: place.category, time: now });
  }, [place]);

  return <View />;
};

export default TimerNotification;
