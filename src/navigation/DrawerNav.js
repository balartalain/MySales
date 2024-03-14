import { StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Entypo';
import StackNav from './StackNav';
import useThemedStyles from '../useThemeStyles';
import Profile from '../screens/Profile';
import Products from '../screens/Products';
const Drawer = createDrawerNavigator();
const productsHeaderStyles = (theme) => ({
  //title: 'My home',
  headerStyle: {
    backgroundColor: theme.primaryColor,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'      
  },
  headerTitleAlign: 'center',
  //headerTitle: (props) => <Button {...props} title='Ticket'/>,
  headerRight: ()=>{
      return <Icon />
   }
})
function DrawerNav() {
  const productsThemedHeaderStyles = useThemedStyles(productsHeaderStyles); 
    return (
      <Drawer.Navigator>       
        <Drawer.Screen name="Sale" 
          component={StackNav} 
          options={{headerShown: false}}
        />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Products" component={Products} options={
            productsThemedHeaderStyles
        } />
      </Drawer.Navigator>      
    );
}
export default DrawerNav;
