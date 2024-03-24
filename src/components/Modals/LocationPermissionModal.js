import { Button, Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Location from "expo-location";

export default function LocationPermissionModal({
  modalVisible,
  setModalVisible,
  startBackgroundLocationUpdates,
}) {
  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted" || backgroundStatus.status !== "granted") {
      setModalVisible(true);
    } else {
      await startBackgroundLocationUpdates();
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

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
