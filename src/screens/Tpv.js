import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Display from '../components/Display';
import ProductList from '../components/ProductList';

export default function Tpv({ navigation }) {
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
      <View style={{ flex: 6 }}>
        <ProductList />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: 10
  },
});
