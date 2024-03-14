import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, Text } from 'react-native';
import RNFS from 'react-native-fs';
import { useProduct } from '../ProductProvider';
import { ThemedButton } from '../components/ThemedComponents';

const AddProduct = ({navigation}) => {
    const {addProduct} = useProduct();
    const [directories, setDirectories] = useState([]);
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

    useEffect(() => {
      const directoryPath = RNFS.DocumentDirectoryPath ;
      console.log(directoryPath);
      RNFS.readdir(directoryPath)
        .then(files => {
          setDirectories(files);
        })
        .catch(error => {
          console.log('Error reading directory:', error);
        });
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
        <View style={{flexDirection: 'row', marginBottom: 10, borderRadius:5, borderWidth:1, borderColor: '#ccc'}}>
          <Image style={{width:100, height:100}} source={require("../../assets/images/no-image.png")}/>
          <View style={{justifyContent: 'space-around'}}>
            <ThemedButton style={{paddingVertical: 6}} bg={'primaryColor'} title="Elija una foto" onPress={handleAddProduct} />
            <ThemedButton style={{paddingVertical: 6}} bg={'primaryColor'} title="Tomar una foto" onPress={handleAddProduct} />    
          </View>
        </View>
        <ThemedButton bg={'primaryColor'} title="Agregar Producto" onPress={handleAddProduct} />
        <View>
          <Text>Directory List:</Text>
          {directories.map((directory, index) => (
            <Text key={index}>{directory}</Text>
          ))}
        </View>
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