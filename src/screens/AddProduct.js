import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Image, Text } from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { useProduct } from '../ProductProvider';
import { ThemedButton } from '../components/ThemedComponents';
import TakePhoto from '../components/TakePhoto';

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
    const createPictureDir = async()=>{
      try{
        const picturePath = `${RNFS.DocumentDirectoryPath}/images`;
        console.log(picturePath)
        await RNFS.mkdir(picturePath);
          
      }
      catch(error){
        console.log('Error creating directory:', error);
      }
    }
    useEffect(() => {
      //createPictureDir();
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

    const onSelectedImage = useCallback((imageUri)=>{
      setProduct({ ...product, image: imageUri });    
    }, [product.imageUri]);
    
    const moveAttachment = async (filePath, newFilepath) => {
      return new Promise((resolve, reject) => {
        RNFS.mkdir(dirPicutures)
          .then(() => {
            RNFS.moveFile(filePath, newFilepath)
              .then(() => {
                console.log('FILE MOVED', filePath, newFilepath);
                resolve(true);
              })
              .catch(error => {
                console.log('moveFile error', error);
                reject(error);
              });
          }) 
          .catch(err => {
            console.log('mkdir error', err);
            reject(err);
          });
      });
    };
    const saveImage = async filePath => {
      try {
        // set new image name and filepath
        const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
        const newFilepath = `${dirPicutures}/${newImageName}`;
        // move and save image to new filepath
        const imageMoved = await moveAttachment(filePath, newFilepath);
        console.log('image moved', imageMoved);
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
        <View style={{flexDirection: 'row', marginBottom: 10, borderRadius:5, borderWidth:1, borderColor: '#ccc'}}>
          <TakePhoto onSelectedImage={onSelectedImage}/>
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