import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedButton } from '../components/ThemedComponents';

let data = [
    {
        id: 1,
        picture: 'https://picsum.photos/200',
        name: 'Cerveza',
        price: 20
    },{
        id: 2,
        picture: 'https://picsum.photos/200',
        name: 'Pure de tomate',
        price: 8
    },{
        id: 3,
        picture: 'https://picsum.photos/200',
        name: 'Refreso de Cola',
        price: 10
    },{
        id: 4,
        picture: 'https://picsum.photos/200',
        name: 'Jugos naturales',
        price: 20
    }
]

function ListItem({item}) {
  console.log('ShoppingCart')
  const onPressItem = ()=>{

  }
  return (
    <View
      style={{
        margin: 2,
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
    </View>
  );
}
export default function ShoppingCart({navigation}){
    return (
        <View  style={{flex:1, justifyContent: 'space-between'}}>
            <View>
            {
                data.map((item, i)=>(
                    <View key={i}>
                        <ListItem item={item} />
                    </View>
                ))            
            }
            </View>
            <ThemedButton 
                style={{margin:10}}
                bg='accentColor'  
                title="Pagar"  
                onPress={()=>{}}           
             />
        </View>
        
    );
}