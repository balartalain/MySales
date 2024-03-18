import * as React from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import { TText } from '../components/ThemedText';
import UTIL from '../utils/Utils';
import { ThemedButton } from '../components/ThemedComponents';

const OpenTurn = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TText h5 title="Especifique la cantidad de efectivo con el que empezará el turno" />
      <TextInput style={styles.input} placeholder="Fondo de caja" />
      <TText h5 title="Aún no ha contado los productos en existencia" />
      <ThemedButton style={{ alignSelf: 'center' }} bg="secondaryColor" title="Crear IPV" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: UTIL.adjust(16),
  },
});
export default OpenTurn;
