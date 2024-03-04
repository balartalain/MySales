import * as React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import useTheme from '../useTheme';

export default function Search({customStyles={}, onChangeText=()=>{}}) {
    const theme = useTheme();
    const onPress = ()=>{
        console.log('3434');
    }
    return (
        <View style={{...styles.container,  ...customStyles}}>
            <TextInput
                placeholder="Buscar artículo"
                style={[styles.textInput, {color: theme.textColor}]}
                onChangeText={onChangeText}
            />
            <TouchableOpacity style={styles.button} onPress={onPress}>               
                <Icon color = { theme.accentColor} name='close' size={20}/>                        
            </TouchableOpacity>            
        </View>       
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 55,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        borderTopColor: 'gray'
    },    
    button: {     
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      //elevation: 2,
      //backgroundColor: 'gray',
      width: '11%'
    },
    textInput: {
      height: '100%',
      fontSize: 27,
      width: '89%'
    }
});
