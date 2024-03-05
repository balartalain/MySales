import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function ProductCard({ item, onPressItem }) {
  console.log('ProductCard')
  return (
    <TouchableOpacity
      onPress={()=>onPressItem(item)}
      style={{
        margin: 1,
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 2,
        paddingRight: 10,
        paddingVertical: 4,
        borderRadius: 0,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <View>
        <Image
          style={{ width: 50, height: 50, borderRadius: 0 }}
          source={{ uri: item.picture }}
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text
          style={{ fontSize: 16 }}
        >{item.name}</Text>
      </View>
      <View>
        <Text>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
export default React.memo(ProductCard);