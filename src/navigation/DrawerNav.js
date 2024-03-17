import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Entypo';
import StackNav from './StackNav';
import { View, StyleSheet } from 'react-native';
import DrawerContent from './DrawerContent';

const Drawer = createDrawerNavigator();
function DrawerNav({ navigation }) {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Sale" component={StackNav} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}
export default DrawerNav;
