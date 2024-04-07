import { createStackNavigator } from "@react-navigation/stack";
import ROUTES from ".";
import MiddleScreen from "../screens/Create/MiddleScreen";
import AddTask from "../screens/Create/AddTask";
import { COLORS } from "../constants/themes";

const Stack = createStackNavigator();

const CreateTaskNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.HEDERROUTES.MIDDLE_STACK.SELECT_CATEGORY}
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
