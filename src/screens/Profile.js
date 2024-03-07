import * as React from 'react';
import { View, Button, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { ThemedButton } from '../components/ThemedComponents';
import RnIncrementDecrementBtn from '../components/RnIncrementDecrementBtn/RnIncrementDecrementBtn';
import useTheme from '../useTheme';
export default function Profile({ navigation }) {
  const theme = useTheme();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{color: theme.textColor}}>Profile screen</Text>
        <ThemedButton bg='primaryColor'  title="primaryColor"/>
        <ThemedButton bg='secondaryColor'>
          <Text>secondaryColor</Text>
        </ThemedButton>        
        <ThemedButton bg='accentColor'  title="accentColor" />
        <ThemedButton bg='textColor'  title="textColor" />
        <ThemedButton bg='accentColor'>
          <Icon name='plus' size={20} color='#fff' />
        </ThemedButton>
        <RnIncrementDecrementBtn activeColor={'accentColor'}/>
      </View>
    );
  }