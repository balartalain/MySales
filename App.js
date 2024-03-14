import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar} from 'react-native';
import codePush from 'react-native-code-push';
import DrawerNav from './src/navigation/DrawerNav';
import ThemeProvider from './src/ThemeProvider';
import {ProductProvider} from './src/ProductProvider';
function App() {
  return (
    <ThemeProvider>  
      <ProductProvider>
        <StatusBar translucent backgroundColor="transparent" />         
        <NavigationContainer>
          <DrawerNav />
        </NavigationContainer>          
      </ProductProvider>   
    </ThemeProvider>  
  );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "red",
//         marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
//       },
//   });
  
  export default codePush(App);