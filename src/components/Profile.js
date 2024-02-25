import * as React from 'react';
import { View, Button, Text } from 'react-native';

export default function Profile({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile screen</Text>
        <Button title="Go back" onPress={() => /* navigation.goBack()*/ navigation.openDrawer()} />
      </View>
    );
  }