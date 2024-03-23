import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getCategories } from "../apis/category";
import { getRecentTasks } from "../apis/tasks";
import { getNearbyPlaces } from "../apis/place";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const LOCATION_TASK_NAME = "background-location-task";

const Home = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastFetchLocation, setLastFetchLocation] = useState(null);
  console.log(lastFetchLocation, "lastFetchLocation");
  const placesRef = useRef(null); // Using useRef to store the places data

  const {
    data,
    isLoading: isLoadingPlaces,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["nearby places"],
    queryFn: () =>
      getNearbyPlaces(
        [lastFetchLocation.longitude, lastFetchLocation.latitude],
        1000
      ),
    enabled: !!lastFetchLocation, // Only run query if userLocation is not null
  });
  console.log(isFetching, "isFetching");
  console.log(nearbyPlaces);
  let places = data?.nearbyPlaces?.map((place) => {
    return {
      name: place.name,
      latitude: place.location.coordinates[1],
      longitude: place.location.coordinates[0],
    };
  });

  useEffect(() => {
    setNearbyPlaces(
      data?.nearbyPlaces?.map((place) => {
        return {
          name: place.name,
          latitude: place.location.coordinates[1],
          longitude: place.location.coordinates[0],
          category: place.category.name,
        };
      })
    );
  }, [data?.nearbyPlaces]);
  // Store fetched places in the ref when they're available and not loading
  useEffect(() => {
    if (!isLoadingPlaces && places) {
      placesRef.current = places;
    }
  }, [places, isLoadingPlaces]);

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

  const startBackgroundLocationUpdates = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 10,
    });
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: recentTasks } = useQuery({
    queryKey: ["recent tasks"],
    queryFn: () => getRecentTasks(),
  });

  // const checkProximityAndExecute = (userLocation) => {
  //   const places = placesRef.current; // Access places from the ref
  //   if (!places) return; // Ensure places data is available before proceeding

  //   places.forEach((place) => {
  //     const distance = calculateDistance(
  //       userLocation.coords.latitude,
  //       userLocation.coords.longitude,
  //       place.latitude,
  //       place.longitude
  //     );
  //     const PROXIMITY_THRESHOLD = 5000; // meters
  //     console.log(distance, "distance");
  //     if (distance <= PROXIMITY_THRESHOLD) {
  //       excutedFunction(place);
  //     }
  //   });
  // };

  const PROXIMITY_THRESHOLD = 500; // meters, for triggering a new places fetch
  const SIGNIFICANT_CHANGE = 500; // meters, minimum change in location to consider for updates

  const checkProximityAndExecute = (userLocation) => {
    const places = placesRef.current;
    if (!places || places.length === 0) {
      fetchPlaces(userLocation); // Initial fetch or refetch when there are no places
      return;
    }

    // Calculate distances to all places and find the closest
    const distances = places.map((place) =>
      calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        place.latitude,
        place.longitude
      )
    );
    const minDistance = Math.min(...distances);

    // Check if user is within proximity threshold of the closest place
    if (minDistance <= PROXIMITY_THRESHOLD) {
      // Execute function when user is within proximity
      console.log(
        "User is within proximity of a place ",
        minDistance.toFixed(0),
        "meters away.",
        places[distances.indexOf(minDistance)],
        "place"
      );
      // excutedFunction(places[distances.indexOf(minDistance)]);
    } else if (minDistance <= 100) {
      fetchPlaces(userLocation); // Fetch new places as user has more than 100 meters away from all places
    } else if (lastFetchLocation) {
      // Check if there's been a significant change in location since last fetch
      const distanceFromLastFetch = calculateDistance(
        lastFetchLocation.latitude,
        lastFetchLocation.longitude,
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );

      if (distanceFromLastFetch >= SIGNIFICANT_CHANGE) {
        fetchPlaces(userLocation); // Fetch new places as user has moved significantly
      }
    }
  };

  // Mock function to demonstrate fetching new places
  const fetchPlaces = (userLocation) => {
    setLastFetchLocation({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    });
    // Here you would call getNearbyPlaces or similar function to update placesRef and possibly state
    // For this example, just log and update lastFetchLocation
    refetch();
    // Note: Remember to handle state updates and re-rendering as needed
  };

  // Define the task handling background location updates
  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    ({ data: { locations }, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      const location = locations[0];
      if (location) {
        checkProximityAndExecute(location);
      }
    }
  );

  return (
    <View style={{ flex: 0.9 }}>
      <View style={styles.container}>
        {lastFetchLocation && (
          <MapView
            followsUserLocation={true}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            initialRegion={{
              latitude: lastFetchLocation.latitude,
              longitude: lastFetchLocation.longitude,
              latitudeDelta: 0.0322,
              longitudeDelta: 0.0081,
            }}
          >
            {nearbyPlaces &&
              nearbyPlaces?.map((place) => (
                <Marker
                  coordinate={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }}
                  title={place.name}
                  description={place.category}
                />
              ))}
            {/* <Marker
                coordinate={{
                  latitude: lastFetchLocation?.latitude,
                  longitude: lastFetchLocation?.longitude,
                }}

                description={"description"}
              /> */}
          </MapView>
        )}
      </View>
      <ScrollView
        contentContainerStyle={
          {
            // paddingTop: insets.top,
            // paddingBottom: insets.bottom,
          }
        }
      >
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24 }}>Categories</Text>
        </View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
          }}
        >
          {categories?.map((category) => (
            <View style={{ width: 200 }} key={category._id}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "gray",
                  borderRadius: 12,
                  padding: 20,
                  gap: 4,
                }}
              >
                <Ionicons name={category?.icon} size={40} color="black" />
                <Text style={{ fontSize: 20 }}>{category?.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 24 }}>Recent Tasks</Text>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, color: "blue" }}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
          }}
        >
          {recentTasks?.map((tasks) => (
            <View style={{ width: 200 }} key={tasks._id}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "gray",
                  borderRadius: 12,
                  padding: 20,
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 20 }}>{tasks?.text}</Text>
                <Text style={{ fontSize: 20 }}>amount: {tasks?.amount}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

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
    </View>
  );
};

/**
 * Calculates the distance between two points on the Earth.
 * @param {number} lat1 Latitude of the first point in degrees
 * @param {number} lon1 Longitude of the first point in degrees
 * @param {number} lat2 Latitude of the second point in degrees
 * @param {number} lon2 Longitude of the second point in degrees
 * @returns {number} The distance between the two points in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
}

mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];
const styles = StyleSheet.create({
  container: {
    height: 400,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Home;
