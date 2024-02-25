import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNav from './StackNav';
import Profile
 from './Profile';
const Drawer = createDrawerNavigator();

function CDrawer() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Sale" component={StackNav} />
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    );
}
export default CDrawer;
