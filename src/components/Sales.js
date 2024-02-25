import * as React from 'react';
import { View, Button, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default function Sales({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon 
          name='menu' 
          size={30} 
          color='#fff'
          onPress={()=>navigation.openDrawer()} 
        />
      ),
    });
  }, [navigation]);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home screen</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('Details')}
        />
      </View>
    );
  }