import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Notifications from "expo-notifications";

const TimerNotification = ({ place }) => {
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
      console.warn("ok! got your notif");
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    const now = new Date();

    // Check if the place is the same as the last place we notified about, or
    // if the current place's category is the same as the last one and it has been less than an hour
    if (
      place !== lastNotification.place &&
      (place.category !== lastNotification.category ||
        now - lastNotification.time > 3600000)
    ) {
      const schedulingOptions = {
        content: {
          title: "TaskSpot Notification",
          body: "You have some tasks to do at " + place.name,
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
    }
  }, [place]);

  return <View />;
};

export default TimerNotification;
