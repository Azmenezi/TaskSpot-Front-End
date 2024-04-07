import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from ".";
import Home from "../screens/Home/Home";
import MyTasks from "../screens/Home/MyTasks";
import CategoryTasks from "../screens/Home/CategoryTasks";
import { COLORS } from "../constants/themes";

const Stack = createStackNavigator();

const HomeNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.HEDERROUTES.HOME.MAIN}
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeNav;
