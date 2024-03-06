import "react-native-gesture-handler";
import { LogBox, StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContext from "./src/contexts/UserContext";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "./src/navigations/BottomNav";
import AuthNavigation from "./src/navigations/AuthNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getToken, removeToken } from "./src/apis/storage";
import jwt_decode from "jwt-decode";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
StatusBar.setBarStyle("light-content", true);

export default function App() {
  const [user, setUser] = useState(null);
  console.log(user);
  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      const decodeUser = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      console.log(decodeUser.exp < currentTime);
      if (decodeUser.exp < currentTime) {
        removeToken();
        return setUser(null);
      }
      setUser(decodeUser);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={{ user, setUser }}>
        <SafeAreaProvider>
          <NavigationContainer>
            {/* <SafeAreaView> */}
            {user ? <BottomNavigation /> : <AuthNavigation />}
            {/* </SafeAreaView> */}
          </NavigationContainer>
        </SafeAreaProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
