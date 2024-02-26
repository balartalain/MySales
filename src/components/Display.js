import * as React from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatCurrency } from "../Utils";

export default function Display() {

    const onPress = ()=>{
        console.log('3434');
    }
    return (
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex:4, alignItems: 'center', justifyContent: 'center', backgroundColor:'green'}}>
            <Text style={{color:'#fff', fontSize: 50}}>{formatCurrency(0)}</Text>
          </View>
          <View style={{flex:1, alignItems: 'center'}}>    
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <View>
                    <Text style={{color:'#000',fontSize: 30}}>0</Text>
                </View>
                <Icon name='shopping-cart' size={40}/>                        
            </TouchableOpacity>        
          </View>
        </View>       
    );
  }
  const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'red'
      },
      button: {     
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        elevation: 3,
        backgroundColor: 'gray',
      },
  });