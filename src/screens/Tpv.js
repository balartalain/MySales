import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Display from '../components/Display';
import ProductList from '../components/ProductList';
import Store from '../Store/Store';
import { ThemedButton } from '../components/ThemedComponents';

export default function Tpv({ navigation }) {
  console.log('TPV');
  const { turn, setTurn } = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const _turn = await Store.getObject('turn');
      if (_turn) {
        setTurn(true);
      }
    })();
  }, [setTurn]);

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
            flex: 5,
          }}
        >
          <ThemedButton bg="primaryColor" title="Abrir turno" />
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
