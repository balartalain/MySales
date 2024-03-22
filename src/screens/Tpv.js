import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Display from '../components/Display';
import ProductList from '../components/ProductList';
import { ThemedButton, TText } from '../components/ThemedComponents';
import POS from '../DAL/Pos';
import { useFocus } from '../hooks/useFocus';

export default function Tpv({ navigation }) {
  const { isFocused } = useFocus();
  const [turn, setTurn] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      if (isFocused) {
        POS.turn.close();
        const _turn = await POS.turn.get();
        if (_turn) {
          setTurn((t) => ({ ..._turn }));
        }
      }
    })();
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          style={{ marginLeft: 5 }}
          name="menu"
          size={30}
          color="#fff"
          onPress={() => navigation.openDrawer()}
        />
      ),
    });
  }, [navigation]);

  const OpenTurn = React.useCallback(() => {
    navigation.navigate('OpenTurn');
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Display />
      {turn && (
        <View style={{ flex: 6 }}>
          <ProductList />
        </View>
      )}
      {!turn && (
        <View
          style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 6,
          }}
        >
          <Icon name="stopwatch" size={80} />
          <TText h5 style={{ marginBottom: 10 }} title={'El turno esta cerrado'} />
          <ThemedButton bg="primaryColor" title="Abrir el turno" onPress={OpenTurn} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10,
  },
});
