import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Image, Text } from 'react-native';
import RNFS from 'react-native-fs';
import { useProduct } from '../ProductProvider';
import { ThemedButton } from '../components/ThemedComponents';
import TakePhoto from '../components/TakePhoto';

const AddProduct = ({ navigation }) => {
  const { addProduct } = useProduct();
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
    product.image = saveImage(product.image);
    addProduct(product);
    // Limpiar el estado del producto después de agregarlo
    setProduct({
      image: '',
      name: '',
      price: '',
    });
  };
  useEffect(() => {
    //createPictureDir();
    const directoryPath = `${RNFS.DocumentDirectoryPath}/images`;
    RNFS.readdir(directoryPath)
      .then((files) => {
        setDirectories(files);
      })
      .catch((error) => {
        console.log('Error reading directory:', error);
      });
  }, [product]);
  const onSelectedImage = useCallback((imageUri) => {
    setProduct((p) => ({ ...p, image: imageUri }));
  }, []);

  const dirPictures = `${RNFS.DocumentDirectoryPath}/images`;
  const moveAttachment = async (filePath, newFilepath) => {
    return new Promise((resolve, reject) => {
      RNFS.mkdir(dirPictures)
        .then(() => {
          RNFS.moveFile(filePath, newFilepath)
            .then(() => {
              //console.log('FILE MOVED', filePath, newFilepath);
              resolve(true);
            })
            .catch((error) => {
              console.log('moveFile error', error);
              reject(error);
            });
        })
        .catch((err) => {
          console.log('mkdir error', err);
          reject(err);
        });
    });
  };
  const saveImage = async (filePath) => {
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}${month}${year}_${hours}${minutes}${seconds}`;
    }
    try {
      // set new image name and filepath
      const newImageName = `${product.name.replace(/ /g, '')}_${formatDate(new Date())}.jpg`;
      const newFilepath = `${dirPictures}/${newImageName}`;
      // move and save image to new filepath
      await moveAttachment(filePath, newFilepath);
      return newImageName;
      //setProduct({ ...product, image: newFilepath });
    } catch (error) {
      console.log(error);
    }
  };
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
        <TakePhoto initialImage={product.image} onSelectedImage={onSelectedImage} />
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
