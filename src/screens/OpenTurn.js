import * as React from 'react';
import { View, Button, TextInput, StyleSheet, Text } from 'react-native';
import { TText } from '../components/ThemedText';
import { ThemedButton } from '../components/ThemedComponents';
import { useResponsive, useResponsiveStyles } from '../hooks/rn-responsive-hook';
//import UTIL from '../utils/Utils';
const OpenTurn = ({ navigation }) => {
  const { s, ms, mvs } = useResponsive();
  const style = useResponsiveStyles(styles);
  return (
    <View style={style.container}>
      <TText h4 title="Especifique la cantidad de efectivo con el que empezará el turno" />
      <TextInput style={style.input} placeholder="Fondo de caja" />
      <TText h5 title="Aún no ha contado los productos en existencia" />
      <Text style={style.text}>Text using MVS {mvs(20)}</Text>
      <Text style={{ fontSize: ms(20) }}>Text using MS {ms(20)}</Text>
      <Text style={{ fontSize: 24 }}>Text using fontsize</Text>
      <ThemedButton style={{ alignSelf: 'center' }} bg="secondaryColor" title="Crear IPV" />
    </View>
  );
};
const styles = ({ s, v, ms, mvs }) => ({
  container: {
    padding: 20,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: mvs(18),
  },
  text: {
    fontSize: mvs(20),
    alignSelf: 'center',
  },
});
export default OpenTurn;
