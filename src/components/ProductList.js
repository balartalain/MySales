import * as React from 'react';
import { View, FlatList, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useProduct } from '../ProductProvider';
import useTheme from '../useTheme';
import Search from './Search';
import ProductCard from './ProductCard';

export default function ProductList({ onSelectItem }) {
  //console.log('ProductList');
  const theme = useTheme();
  const { products } = useProduct();
  const [searchValue, changeSearchValue] = React.useState();
  const [data, setData] = React.useState(products);
  const [selectedItem, setSelectedItem] = React.useState();
  const onSearchText = React.useCallback(
    (text) => {
      const filterData = products.filter((item) => item.name.includes(text) || text === '');
      setData(filterData);
    },
    [products],
  );
  React.useEffect(() => {
    setData(products);
  }, [products]);
  const onPressItem = React.useCallback((item) => {
    setSelectedItem(item.code);
  }, []);

  const renderItem = React.useCallback(
    ({ item }) => {
      return <ProductCard item={item} onPressItem={onPressItem} />;
    },
    [onPressItem],
  );
  console.log(products);
  return (
    <View>
      <Search onChangeText={onSearchText} />
      <FlatList
        style={styles.container}
        itemHeight={60}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});
