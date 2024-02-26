import * as React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default function Search({customStyles={}, onChangeText=()=>{}}) {

    const onPress = ()=>{
        console.log('3434');
    }
    return (
        <View style={{...styles.container,  ...customStyles}}>
            <TextInput
                placeholder="Buscar artículo"
                style={styles.textInput}
                onChangeText={onChangeText}
            />
            <TouchableOpacity style={styles.button} onPress={onPress}>               
                <Icon name='close' size={20}/>                        
            </TouchableOpacity>            
        </View>       
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 55,         
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    button: {     
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      elevation: 3,
      backgroundColor: 'gray',
      width: '10%'
    },
    textInput: {
      height: '100%',
      fontSize: 27,
      width: '90%'
    }
});
