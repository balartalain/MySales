import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = React.createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const generateProductCode = async () => {
    let nextCode = (await AsyncStorage.getItem('sequenceCode')) || 0;
    nextCode = parseInt(nextCode, 10) + 1;
    await AsyncStorage.setItem('sequenceCode', nextCode.toString());
    const paddedCode = nextCode.toString().padStart(4, '0'); // Asegura que el código tenga 4 dígitos
    return paddedCode;
  };
  // Cargar productos almacenados al inicio
  const loadProducts = async () => {
    try {
      await AsyncStorage.clear();
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts !== null) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading products from AsyncStorage:', error);
    }
  };
  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);
  const addProduct = async (product) => {
    const code = await generateProductCode();
    product.code = code;
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  };
  return (
    <ProductContext.Provider value={{ products, addProduct }}>{children}</ProductContext.Provider>
  );
};

const useProduct = () => {
  return useContext(ProductContext);
};

export { ProductProvider, ProductContext, useProduct };
