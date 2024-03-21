import * as React from 'react';
import { View, Button, TextInput, StyleSheet, Text } from 'react-native';
import { TText } from '../components/ThemedText';
import { ThemedButton } from '../components/ThemedComponents';
import { useResponsive, useResponsiveStyles } from '../hooks/rn-responsive-hook';
import POS from '../DAL/Pos';

const OpenTurn = ({ navigation }) => {
  const style = useResponsiveStyles(styles);
  const [fund, setFund] = React.useState();
  const handleInputChange = (value) => {
    setFund(value);
  };
  const openTurn = async () => {
    const turn = {
      startingDate: Date.now(),
      fund,
    };
    await POS.turn.save(turn);
    await POS.turn.get();
  };
  const createIpv = () => {
    navigation.navigate('Ipv');
  };
  return (
    <View style={style.container}>
      <View>
        <TText h4 title="Especifique la cantidad de efectivo con el que empezará el turno" />
        <TextInput
          style={style.input}
          placeholder="Fondo de caja"
          onChangeText={handleInputChange}
        />
        <TText h3 title="Aún no ha contado los productos en existencia" />
        <ThemedButton
          style={style.ipvBtn}
          textStyle={{ color: '#000' }}
          title="Crear IPV"
          onPress={createIpv}
        />
      </View>
      <View>
        <ThemedButton
          onPress={openTurn}
          style={{ alignSelf: 'center' }}
          bg="secondaryColor"
          title="Abrir el turno"
        />
      </View>
    </View>
  );
};
const aaa = StyleSheet.create({
  a: {
    justifyContent: 'space-between',
  },
});
const styles = ({ s, v, ms, mvs }) => ({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: mvs(16),
  },
  text: {
    fontSize: mvs(20),
    alignSelf: 'center',
  },
  ipvBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    //alignSelf: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
});
export default OpenTurn;
