import * as React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Display from '../components/Display';
import Search from '../components/Search';
import ProductList from '../components/ProductList';

export default function Tpv({ navigation }) {
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
      <View style={{ flex: 1 }}>
        <Display/>
        <View style={{flex:6}}>
         <ProductList />
        </View>
      </View>

    );
  }
  const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'red'
      },
  });