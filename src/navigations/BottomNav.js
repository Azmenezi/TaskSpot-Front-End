import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ROUTES from ".";
import UserContext from "../contexts/UserContext";
import LeftScreen from "../screens/LeftScreen";
import MiddleScreen from "../screens/MiddleScreen";
import RightScreen from "../screens/RightScreen";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  const { user } = useContext(UserContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffffff",
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
        name={ROUTES.HEDERROUTES.LEFT_STACK.STACK}
        component={LeftScreen}
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
            <Ionicons name="notifications" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.HEDERROUTES.RIGHT_STACK.STACK}
        component={RightScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
