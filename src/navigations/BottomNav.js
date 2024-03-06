import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ROUTES from ".";
import MiddleScreen from "../screens/MiddleScreen";
import RightScreen from "../screens/RightScreen";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 60,
          borderTopColor: "#ffffff",
          borderTopWidth: 0.2,
          bottom: 15,
          left: 20,
          right: 20,
          borderRadius: 20,
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HEDERROUTES.HOME.STACK}
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons name="md-home" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.HEDERROUTES.MIDDLE_STACK.STACK}
        component={MiddleScreen}
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
        component={RightScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{}}>
              <Ionicons name="person" size={30} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
