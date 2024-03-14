import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useProduct } from '../ProductProvider';
import { ThemedButton } from '../components/ThemedComponents';

const AddProduct = ({navigation}) => {
    const {addProduct} = useProduct();
    const [product, setProduct] = useState({
      image: '',
      name: '',
      price: '',
    });

    const handleInputChange = (fieldName, value) => {
        setProduct({ ...product, [fieldName]: value });        
    };
    const handleAddProduct = () => {
        addProduct(product);
    // Limpiar el estado del producto después de agregarlo
    setProduct({
        image: '',
        name: '',
        price: '',
    });
    };
    return (
    <View style={styles.container}>
        <TextInput
        style={styles.input}
        placeholder="URL de imagen"
        value={product.image}
        onChangeText={(value) => handleInputChange('image', value)}
        />
        <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={product.name}
        onChangeText={(value) => handleInputChange('name', value)}
        />
        <TextInput
        style={styles.input}
        placeholder="Precio"
        value={product.price}
        onChangeText={(value) => handleInputChange('price', value)}
        keyboardType="numeric"
        />
        <ThemedButton bg={'primaryColor'} title="Agregar Producto" onPress={handleAddProduct} />
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default AddProduct;