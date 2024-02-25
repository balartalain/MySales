import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import codePush from 'react-native-code-push';
import CDrawer from './src/components/CDrawer';

function App() {
    return (
      <NavigationContainer>
        <CDrawer />
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'red'
      },
  });
  
  export default codePush(App);