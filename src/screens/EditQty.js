import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedButton } from '../components/ThemedComponents';
import RnIncrementDecrementBtn from '../components/RnIncrementDecrementBtn/RnIncrementDecrementBtn';

export default function EditQty({item}){
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <Text>Pure de tomate</Text>
      <RnIncrementDecrementBtn
          activeColor={'accentColor'}
          handleClick={(val)=>console.log(val)}
          styleBtn={{width:40,height:40}}
          styleTextInput={{width:40,height:40}}
          labelStyle={{fontSize:16}}
          iconStyle={{color:'blue', size:20}}
      />
    </View>
  )
}