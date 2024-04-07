import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from ".";
import CategoryTasks from "../screens/Home/CategoryTasks";
import MyTasks from "../screens/Home/MyTasks";
import RightScreen from "../screens/RightScreen";
import { COLORS } from "../constants/themes";

const Stack = createStackNavigator();

const ProfileNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.HEDERROUTES.RIGHT_STACK.MAIN}
        component={RightScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HEDERROUTES.RIGHT_STACK.MY_TASKS}
        component={MyTasks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HEDERROUTES.RIGHT_STACK.CATEGORY_TASKS}
        component={CategoryTasks}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNav;
