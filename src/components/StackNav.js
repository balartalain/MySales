import { createStackNavigator } from '@react-navigation/stack';
import Sales from './Sales';
import Profile from './Profile';

const Stack = createStackNavigator();
function StackNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Sales" component={Sales} />
        { /*<Stack.Screen name="Notifications" component={Notifications} /> */}
        <Stack.Screen name="Profile" component={Profile} />
        { /*< Stack.Screen name="Settings" component={Settings} /> */}
      </Stack.Navigator>
    );
  }
  export default StackNav;