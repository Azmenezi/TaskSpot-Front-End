import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getCategories } from "../../apis/category";
import { getNearbyPlaces } from "../../apis/place";
import { getMyTasks } from "../../apis/tasks";
import HorizintalCategories from "../../components/Home/HorizontalScrollview";
import RecentTasks from "../../components/Home/RecentTasks";
import LocationPermissionModal from "../../components/Modals/LocationPermissionModal";
import TimerNotification from "../../components/TimerNotification";
import { calculateDistance } from "../../funcs/calculateDistance";
import { mapStyle } from "../../style/mapStyle";

const LOCATION_TASK_NAME = "background-location-task";

const userCanChange = {
  nearbyPlacesRadius: 1000,
  PROXIMITY_THRESHOLD: 1000,
  distanceInterval: 1,
};

const Home = () => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastFetchLocation, setLastFetchLocation] = useState(null);
  const [closestPlace, setClosestPlace] = useState(null); // The closest place to the user
  const [usingForgroundLocation, setUsingForgroundLocation] = useState(false); // Using forground location updates
  const placesRef = useRef(null); // Using useRef to store the places data

  const { data: myTasks } = useQuery({
    queryKey: ["my tasks"],
    queryFn: () => getMyTasks(),
  });

  const {
    data,
    isLoading: isLoadingPlaces,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["nearby places"],
    queryFn: () =>
      getNearbyPlaces(
        [lastFetchLocation.longitude, lastFetchLocation.latitude],
        userCanChange.nearbyPlacesRadius
      ),
    enabled: !!lastFetchLocation, // Only run query if userLocation is not null
  });

  useEffect(() => {
    setNearbyPlaces(
      data?.nearbyPlaces?.map((place) => {
        return {
          name: place.name,
          latitude: place.location.coordinates[1],
          longitude: place.location.coordinates[0],
          category: place.category,
        };
      })
    );
  }, [data?.nearbyPlaces]);

  // Store fetched places in the ref when they're available and not loading
  let places = data?.nearbyPlaces?.map((place) => {
    return {
      name: place.name,
      latitude: place.location.coordinates[1],
      longitude: place.location.coordinates[0],
      category: place.category,
    };
  });
  useEffect(() => {
    if (!isLoadingPlaces && places) {
      placesRef.current = places;
    }
  }, [places, isLoadingPlaces]);

  const startBackgroundLocationUpdates = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true,
    });
  };

  const PROXIMITY_THRESHOLD = userCanChange.PROXIMITY_THRESHOLD; // meters, for triggering a new places fetch
  const SIGNIFICANT_CHANGE = userCanChange.nearbyPlacesRadius / 2; // meters, minimum change in location to consider for updates

  const checkProximityAndExecute = (userLocation) => {
    const places = placesRef.current;
    if (!lastFetchLocation)
      return setLastFetchLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
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
      if (closestPlace !== places[distances.indexOf(minDistance)]) {
        setClosestPlace(places[distances.indexOf(minDistance)]);
      }

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

  // function to fetching new places
  const fetchPlaces = (userLocation) => {
    setLastFetchLocation({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    });

    refetch();
  };

  // the task handling background location updates
  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    ({ data: { locations }, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      const location = locations[0];
      if (location) {
        if (isFetching) return;
        if (usingForgroundLocation) return;
        checkProximityAndExecute(location);
      }
    }
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {lastFetchLocation ? (
          <MapView
            followsUserLocation={true}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            initialRegion={{
              latitude: lastFetchLocation?.latitude,
              longitude: lastFetchLocation?.longitude,
              latitudeDelta: 0.0322,
              longitudeDelta: 0.0081,
            }}
          >
            {nearbyPlaces &&
              nearbyPlaces?.map((place) => (
                <Marker
                  key={place.name}
                  coordinate={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }}
                  title={place.name}
                  description={place.category.name}
                >
                  <Ionicons
                    name={place.category.icon}
                    size={22}
                    color={closestPlace?.name === place.name ? "red" : "black"}
                  />
                </Marker>
              ))}
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="black" />
        )}
      </View>

      {closestPlace && (
        <TimerNotification
          place={closestPlace}
          tasks={myTasks.filter((task) => !task.done)}
        />
      )}
      <LocationPermissionModal
        usingForgroundLocation={usingForgroundLocation}
        setUsingForgroundLocation={setUsingForgroundLocation}
        isFetching={isFetching}
        checkProximityAndExecute={checkProximityAndExecute}
        startBackgroundLocationUpdates={startBackgroundLocationUpdates}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Home;
