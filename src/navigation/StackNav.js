import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Tpv from '../screens/Tpv';
import Details from '../screens/Details';
import ShoppingCart from '../screens/ShoppingCart';
import useTheme from '../useTheme';
import useThemedStyles from '../useThemeStyles';
import EditQty from '../screens/EditQty';
import AddProduct from '../screens/AddProduct';
import Products from '../screens/Products';
import OpenTurn from '../screens/OpenTurn';
import IPV from '../screens/Ipv';
import SortableList from '../components/SortableList';
import Animations from '../components/SortableList';
const Stack = createStackNavigator();
const salesHeaderStyles = (theme) => ({
  //title: 'My home',
  headerStyle: {
    backgroundColor: theme.primaryColor,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center',
  headerTitle: (props) => <Button {...props} title="Ticket" />,
  headerLeft: () => {
    return <Icon />;
  },
});
const productsHeaderStyles = (theme) => ({
  //title: 'My home',
  headerStyle: {
    backgroundColor: theme.primaryColor,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center',
  //headerTitle: (props) => <Button {...props} title='Ticket'/>,
  headerRight: () => {
    return <Icon />;
  },
});
function StackNav() {
  const salesThemedHeaderStyles = useThemedStyles(salesHeaderStyles);
  const productsThemedHeaderStyles = useThemedStyles(productsHeaderStyles);
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Tpv" component={Tpv} options={salesThemedHeaderStyles} />
      <Stack.Screen name="Products" component={Products} options={productsThemedHeaderStyles} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Carrito" component={ShoppingCart} />
      <Stack.Screen name="EditQty" component={EditQty} />
      <Stack.Screen
        name="AddProduct"
        //options={{ animationEnabled: false }}
        component={AddProduct}
      />
      <Stack.Screen
        name="OpenTurn"
        //options={{ animationEnabled: false }}
        component={OpenTurn}
      />
      <Stack.Screen name="Ipv" component={IPV} />
      <Stack.Screen name="Draggable" component={SortableList} options={{ headerShown: true }} />
      <Stack.Screen name="Animations" component={Animations} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}
export default StackNav;
