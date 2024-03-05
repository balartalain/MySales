import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNav from './StackNav';
import Profile from '../screens/Profile';
const Drawer = createDrawerNavigator();

function DrawerNav() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Sale" 
          component={StackNav} 
          options={{headerShown: false}}
        />
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    );
}
export default DrawerNav;
