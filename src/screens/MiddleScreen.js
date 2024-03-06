import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MiddleScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,

        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Text>MiddleScreen</Text>
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
