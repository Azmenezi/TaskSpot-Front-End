import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from ".";
import MiddleScreen from "../screens/MiddleScreen";
import AddTask from "../screens/Create/AddTask";

const Stack = createStackNavigator();

const CreateTaskNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.HEDERROUTES.MIDDLE_STACK.STACK}
        component={MiddleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HEDERROUTES.MIDDLE_STACK.CREATE_TASK}
        component={AddTask}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CreateTaskNav;
