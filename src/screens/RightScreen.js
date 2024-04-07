import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HorizintalCategories from "../components/Home/HorizontalScrollview";
import RecentTasks from "../components/Home/RecentTasks";
import { getCategories } from "../apis/category";
import { getMyTasks } from "../apis/tasks";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header/Header";
import { removeToken } from "../apis/storage";
import UserContext from "../contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/themes";

const RightScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { setUser, user } = useContext(UserContext);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: myTasks } = useQuery({
    queryKey: ["my tasks"],
    queryFn: () => getMyTasks(),
  });

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Logout ",
      "are you sure you want to log out from your account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            removeToken();
            setUser(false);
          },
        },
      ]
    );
  return (
    <>
      <Header
        right={
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.behindItem,
                borderRadius: 8,
                padding: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => createTwoButtonAlert()}
            >
              <Ionicons name="log-out" size={30} color={COLORS.whiteText} />
            </TouchableOpacity>
          </View>
        }
      >
        <Text style={{ fontSize: 24, color: COLORS.whiteText }}>
          {user?.username}
        </Text>
      </Header>

      <ScrollView>
        <View style={{ padding: 14 }}>
          <View
            style={{
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: COLORS.behindItem,
              paddingBottom: 16,
              paddingTop: 16,
            }}
          >
            <HorizintalCategories
              categories={categories}
              navigation={navigation}
            />
          </View>
        </View>
        <View style={{ padding: 14 }}>
          <View
            style={{
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: COLORS.behindItem,
              paddingBottom: 16,
              paddingTop: 16,
            }}
          >
            <RecentTasks
              categories={categories}
              tasks={myTasks}
              navigation={navigation}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default RightScreen;
