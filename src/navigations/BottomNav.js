import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ROUTES from ".";
import MiddleScreen from "../screens/Create/MiddleScreen.js";
import RightScreen from "../screens/RightScreen";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Home from "../screens/Home/Home.js";
import { View } from "react-native";
import CreateTaskNav from "./CreateTaskNav.js";
import HomeNav from "./HomeNav.js";
import ProfileNav from "./ProfileNav.js";

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "black",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 60,
          borderTopColor: "#ffffff",
          borderTopWidth: 0.2,
          bottom: 25,
          left: 20,
          right: 20,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: -6,
            height: 8,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          elevation: 5,
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HEDERROUTES.HOME.STACK}
        component={HomeNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{ top: 10 }}>
              <Ionicons name="location" size={30} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.HEDERROUTES.MIDDLE_STACK.STACK}
        component={CreateTaskNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 200,
                height: 75,
                width: 75,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="add-circle" size={50} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.HEDERROUTES.RIGHT_STACK.STACK}
        component={ProfileNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{ top: 10 }}>
              <FontAwesome5 name="clipboard-list" size={30} color={color} />
              {/* <Ionicons name="person" /> */}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
