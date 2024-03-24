import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from ".";
import Home from "../screens/Home/Home";
import MyTasks from "../screens/Home/MyTasks";
import CategoryTasks from "../screens/Home/CategoryTasks";

const Stack = createStackNavigator();

const HomeNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.HEDERROUTES.HOME.MAIN}
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HEDERROUTES.HOME.MY_TASKS}
        component={MyTasks}
      />
      <Stack.Screen
        name={ROUTES.HEDERROUTES.HOME.CATEGORY_TASKS}
        component={CategoryTasks}
        options={({ route }) => ({
          title: route.params.category + " tasks" || "Tasks", // Fallback to "Tasks" if categoryName is undefined
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeNav;
