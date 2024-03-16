import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

function ProductCard({ item, onPressItem }) {
  //console.log('ProductCard')
  return (
    <TouchableOpacity onPress={() => onPressItem(item)} style={styles.productItem}>
      <View>
        <Image
          style={styles.productImage}
          source={item.image ? { uri: item.image } : require('../../assets/images/no-image.png')}
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </View>
      <View>
        <Text>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
  },
});
export default React.memo(ProductCard);
