import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import codePush from 'react-native-code-push';

function App() {
    const backgroundStyle = {
      backgroundColor: 'red',
    };
  
    return ( 
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, backgroundColor: 'yellow' }}></View>
            <View style={{ flex: 2, backgroundColor: 'blue' }}></View>
            <View style={{ flex: 1, backgroundColor: 'green' }}></View>
        </View>    

)}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'red'
      },
  });
  
  export default codePush(App);