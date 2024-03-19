import * as React from 'react';
import { View, Button, TextInput, StyleSheet, Text } from 'react-native';
import { TText } from '../components/ThemedText';
import { ThemedButton } from '../components/ThemedComponents';
import { fs, fvs, ffs, useResponsive, useResponsiveStyles } from '../hooks/rn-responsive-hook';
import UTIL from '../utils/Utils';
const OpenTurn = ({ navigation }) => {
  const { scale } = useResponsive();
  const style = useResponsiveStyles(styles);
  return (
    <View style={style.container}>
      <TText h4 title="Especifique la cantidad de efectivo con el que empezará el turno" />
      <TextInput style={style.input} placeholder="Fondo de caja" />
      <TText h5 title="Aún no ha contado los productos en existencia" />
      <ThemedButton style={{ alignSelf: 'center' }} bg="secondaryColor" title="Crear IPV" />
    </View>
  );
};
const styles = ({ scale, verticalScale, fontScale }) => ({
  container: {
    padding: 20,
  },
  input: {
    marginVertical: 10,
    padding: verticalScale(10),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: fontScale(16),
  },
  text: {
    fontSize: fontScale(30),
    alignSelf: 'center',
  },
});
export default OpenTurn;
