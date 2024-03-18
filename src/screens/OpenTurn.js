import * as React from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import { TText } from '../components/ThemedText';
import UTIL from '../utils/Utils';
import { ThemedButton } from '../components/ThemedComponents';
import { ScaledSheet } from 'react-native-size-matters';

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
const styles = ScaledSheet.create({
  container: {
    padding: '20@ms',
  },
  input: {
    marginVertical: '10@vs',
    padding: '10@ms',
    borderWidth: '1@ms',
    borderColor: '#ccc',
    borderRadius: '5@ms',
    //fontSize: UTIL.adjust(16),
    fontSize: '16@ms',
  },
});
export default OpenTurn;
