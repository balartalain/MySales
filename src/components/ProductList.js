import * as React from 'react';
import { View, FlatList, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import useTheme from '../useTheme';
import Search from './Search';
import ProductCard from './ProductCard';
let origData = [
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
    },{
        id: 5,
        picture: 'https://picsum.photos/200',
        name: 'Product Vino tinto',
        price: 8
    },{
        id: 6,
        picture: 'https://picsum.photos/200',
        name: 'Product 3',
        price: 10
    },{
        id: 7,
        picture: 'https://picsum.photos/200',
        name: 'Product 1',
        price: 20
    },{
        id: 8,
        picture: 'https://picsum.photos/200',
        name: 'Product 2',
        price: 8
    },{
        id: 9,
        picture: 'https://picsum.photos/200',
        name: 'Product 3',
        price: 10
    }
]
export default function ProductList({onSelectItem}) {
    console.log('ProductList');
    const theme = useTheme();
    const [searchValue, changeSearchValue] = React.useState('ABC');
    const [data, setData] = React.useState(origData);
    const onSearchText = React.useCallback((text) =>{        
        const filterData = origData.filter(item=>item.name.includes(text) || text === '' )
        //console.log(text);
        setData(filterData);
    }, [])
    return (
        <View >      
            <Search onChangeText={onSearchText} />
            <FlatList
                itemHeight={60}
                data={data}
                renderItem={ProductCard}
                keyExtractor={(item) => item.id}
            />
        </View>               
    );
}
const styles = StyleSheet.create({
})