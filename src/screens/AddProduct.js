import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Image, Text } from 'react-native';
import RNGRP from 'react-native-get-real-path';
import { useProduct } from '../ProductProvider';
import { ThemedButton } from '../components/ThemedComponents';
import TakePhoto from '../components/TakePhoto';
import UTIL from '../utils/Utils';

const AddProduct = ({ navigation }) => {
  const { addProduct } = useProduct();
  //const [directories, setDirectories] = useState([]);
  const [product, setProduct] = useState({
    image: undefined,
    name: '',
    price: '',
  });

  const handleInputChange = (fieldName, value) => {
    setProduct({ ...product, [fieldName]: value });
  };
  const handleAddProduct = async () => {
    if (product.image) {
      RNGRP.getRealPathFromURI(product.image).then(async (filePath) => {
        try {
          const image = await UTIL.FS.saveImage(filePath, product.name);
          addProduct({ ...product, image: `file://${image}` });
          setProduct({
            image: undefined,
            name: '',
            price: '',
          });
        } catch (err) {
          console.log('ERROR: ' + err);
          //product.image = undefined;
        }
      });
    } else {
      addProduct(product);
      setProduct({
        image: undefined,
        name: '',
        price: '',
      });
    }
  };

  const onSelectedPicture = useCallback((imageUri) => {
    setProduct((p) => ({ ...p, image: imageUri }));
  }, []);

  return (
    <View style={styles.container}>
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
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      >
        <TakePhoto picture={product.image} onSelectedPicture={onSelectedPicture} />
      </View>
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
