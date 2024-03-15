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
    photo: undefined,
    name: '',
    price: '',
  });

  const handleInputChange = (fieldName, value) => {
    setProduct({ ...product, [fieldName]: value });
  };
  const handleAddProduct = async () => {
    if (product.photo) {
      RNGRP.getRealPathFromURI(product.photo).then(async (filePath) => {
        //console.log('VVVVV ' + filePath);
        try {
          const photo = await UTIL.FS.saveImage(filePath, product.name);
          addProduct({ ...product, photo: `file://${photo}` });
          setProduct({
            photo: undefined,
            name: '',
            price: '',
          });
        } catch (err) {
          console.log('ERROR: ' + err);
          //product.photo = undefined;
        }
      });
    }
  };

  const onSelectedPicture = useCallback((imageUri) => {
    setProduct((p) => ({ ...p, photo: imageUri }));
    //console.log('VVVVVVVVV ' + imageUri);
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
        <TakePhoto picture={product.photo} onSelectedPicture={onSelectedPicture} />
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
