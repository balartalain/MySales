import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';

function App() {
    const backgroundStyle = {
      backgroundColor: 'red',
    };
  
    return ( 
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, backgroundColor: 'red' }}></View>
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
  
  export default App;