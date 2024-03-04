import * as React from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatCurrency } from "../Utils";
import useTheme from '../useTheme';
export default function Display() {
    const theme = useTheme();
    const onPress = ()=>{
        console.log('3434');
    }
    return (
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex:4, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.accentColor}}>
            <Text style={{color:'#fff', fontSize: 50}}>{formatCurrency(0)}</Text>
          </View>
          <View style={{flex:1, alignItems: 'center'}}>    
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={{color: theme.secondaryColor, fontSize: 30}}>0</Text>
                <Icon color = {theme.secondaryColor} name='shopping-cart' size={40}/>                        
            </TouchableOpacity>        
          </View>
        </View>       
    );
  }
  const styles = StyleSheet.create({
    button: {     
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
  });