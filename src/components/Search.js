import * as React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import useTheme from '../useTheme';

function Search({ customStyles = {}, onChangeText = () => {} }) {
  //console.log('Search');
  const inputRef = React.useRef(null);
  const theme = useTheme();
  const clearTex = () => {
    inputRef.current.setNativeProps({ text: '' });
    onChangeText('');
  };

  return (
    <View style={{ ...styles.container, ...customStyles }}>
      <TextInput
        ref={inputRef}
        placeholder="Buscar artículo"
        style={[styles.textInput, { color: theme.textColor }]}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.button} onPress={clearTex}>
        <Icon color={theme.accentColor} name="close" size={20} />
      </TouchableOpacity>
    </View>
  );
}
export default React.memo(Search);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderTopColor: 'gray',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    //elevation: 2,
    //backgroundColor: 'gray',
    width: '11%',
  },
  textInput: {
    height: '100%',
    fontSize: 27,
    width: '89%',
  },
});
