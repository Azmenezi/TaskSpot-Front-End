import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCategories } from "../apis/category";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import ROUTES from "../navigations";

const MiddleScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  console.log(categories);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        justifyContent: "space-between",
      }}
    >
      <View style={{ padding: 16, justifyContent: "center" }}>
        <Text style={{ fontSize: 24, textAlign: "center" }}>
          Choose a category
        </Text>
        <Text style={{ fontSize: 24, textAlign: "center" }}>
          to add a task to
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        {categories?.map((category) => (
          <View style={{ padding: 8, width: "50%" }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  ROUTES.HEDERROUTES.MIDDLE_STACK.CREATE_TASK,
                  { category }
                )
              }
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
      </View>
    </ScrollView>
  );
};

export default MiddleScreen;

// import { View, Text, ScrollView } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as Location from "expo-location";
// const MiddleScreen = () => {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     })();
//   }, []);

//   let text = "Waiting..";
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//   }
//   //https://maps.google.com/?q=<lat>,<lng>
//   console.log(location?.coords?.latitude, " ", location?.coords?.longitude);
//   return (
//     <View style={{ justifyContent: "center", alignSelf: "center" }}>
//       <Text style={{}}>{text}</Text>
//     </View>
//   );
// };

// export default MiddleScreen;
