import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Tpv from './Tpv';
import Details from './Details';

const Stack = createStackNavigator();
const salesHeaderStyles = {
    //title: 'My home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
     headerTitle: (props) => <Button {...props} title='Ticket'/>,
     headerLeft: ()=>{
        return <Icon />
     }
  }
function StackNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Tpv" component={Tpv} 
            options={salesHeaderStyles}
        />
        { /*<Stack.Screen name="Notifications" component={Notifications} /> */}
        <Stack.Screen name="Details" component={Details} />
        { /*< Stack.Screen name="Settings" component={Settings} /> */}
      </Stack.Navigator>
    );
  }
  export default StackNav;