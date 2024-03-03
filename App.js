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
import DrawerNav from './src/components/DrawerNav';
import ThemeProvider from './src/ThemeProvider';
function App() {
    return (
      <ThemeProvider>
        <NavigationContainer>
          <DrawerNav />
        </NavigationContainer>
      </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'red'
      },
  });
  
  export default codePush(App);