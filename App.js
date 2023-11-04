import "react-native-gesture-handler";
import { LogBox, StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContext from "./src/contexts/UserContext";
import { useState } from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "./src/navigations/BottomNav";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
StatusBar.setBarStyle("light-content", true);

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={{ user, setUser }}>
        <NavigationContainer theme={DarkTheme}>
          {/* <SafeAreaView> */}
          <BottomNavigation />
          {/* </SafeAreaView> */}
        </NavigationContainer>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
