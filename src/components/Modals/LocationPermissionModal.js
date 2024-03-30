import { AppState, Button, Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Location from "expo-location";

export default function LocationPermissionModal({
  modalVisible,
  setModalVisible,
  startBackgroundLocationUpdates,
  checkProximityAndExecute,
  isFetching,
  usingForgroundLocation,
  setUsingForgroundLocation,
}) {
  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted" || backgroundStatus.status !== "granted") {
      setModalVisible(true);
    } else {
      await startBackgroundLocationUpdates();
      setModalVisible(false);
    }
  };
  const checkLocationServicesEnabled = async () => {
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      // Prompt user to enable location services
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    checkLocationServicesEnabled();
  }, []);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    let foregroundSubscription;

    const watchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        foregroundSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Trigger updates every meter.
            timeInterval: 10000, // Trigger updates every second.
          },
          async (location) => {
            if (isFetching) return;
            console.log("firstLocation, location");
            checkProximityAndExecute(location);
            if (!usingForgroundLocation) {
              // Stop background updates if they are running
              const isBackgroundLocationRunning =
                await Location.hasStartedLocationUpdatesAsync(
                  LOCATION_TASK_NAME
                );
              if (isBackgroundLocationRunning) {
                await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
              }
              setUsingForgroundLocation(true);
            }
          }
        );
      }
    };

    watchPosition();

    return () => {
      setUsingForgroundLocation(false);
      foregroundSubscription && foregroundSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background") {
        setUsingForgroundLocation(false);
        startBackgroundLocationUpdates().catch(console.error);
      }
    };

    // Add the event listener and keep the subscription object
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Use the subscription object to remove the event listener
    return () => {
      appStateSubscription.remove();
    };
  }, [setUsingForgroundLocation, startBackgroundLocationUpdates]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        alert("You need to enable location permissions to use this app.");
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 16 }}>Location Permission Required</Text>
          <Text style={{ marginVertical: 10 }}>
            This app needs location permissions to function properly. Please
            grant location access.
          </Text>
          <Button
            title="Grant Permissions"
            onPress={() => {
              requestPermissions();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
