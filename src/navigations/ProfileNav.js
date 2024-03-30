import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from ".";
import CategoryTasks from "../screens/Home/CategoryTasks";
import MyTasks from "../screens/Home/MyTasks";
import RightScreen from "../screens/RightScreen";

const Stack = createStackNavigator();

const ProfileNav = () => {
  return (
    <Stack.Navigator>
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
        options={({ route }) => ({
          title: route.params.category + " tasks" || "Tasks", // Fallback to "Tasks" if categoryName is undefined
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileNav;
