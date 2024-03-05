import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Tpv from '../screens/Tpv';
import Details from '../screens/Details';
import useTheme from '../useTheme';
import useThemedStyles from '../useThemeStyles';

const Stack = createStackNavigator();
const salesHeaderStyles = (theme) => ({
    //title: 'My home',
    headerStyle: {
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'      
    },
    headerTitleAlign: 'center',
    headerTitle: (props) => <Button {...props} title='Ticket'/>,
    headerLeft: ()=>{
        return <Icon />
     }
  })
function StackNav() {
  const salesThemedHeaderStyles = useThemedStyles(salesHeaderStyles); 
    return (
      <Stack.Navigator>
        <Stack.Screen name="Tpv" component={Tpv} 
            options={salesThemedHeaderStyles}
        />
        { /*<Stack.Screen name="Notifications" component={Notifications} /> */}
        <Stack.Screen name="Details" component={Details} />
        { /*< Stack.Screen name="Settings" component={Settings} /> */}
      </Stack.Navigator>
    );
  }
  export default StackNav;