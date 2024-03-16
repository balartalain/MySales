import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { useProduct } from '../ProductProvider';

const renderProductItem = ({ item }) => (
  <View style={styles.productItem}>
    <Image
      source={item.image ? { uri: item.image } : require('../../assets/images/no-image.png')}
      style={styles.productImage}
    />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Precio: ${item.price}</Text>
    </View>
  </View>
);
const Products = ({ navigation }) => {
  const { products } = useProduct();
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          style={{ marginRight: 5 }}
          name="plus"
          size={30}
          color="#fff"
          onPress={() => navigation.navigate('AddProduct')}
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.name.replaceAll(' ', '')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCode: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default Products;
