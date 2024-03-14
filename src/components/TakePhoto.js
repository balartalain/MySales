import React, { useState, useEffect, memo } from 'react';
import { View, TextInput, StyleSheet, Image, Text } from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import { ThemedButton } from './ThemedComponents'

const TakePhoto =  ({onSelectedImage})=>{
    const [image, setSelectedImage] = useState(null);

    console.log('TakePhoto');
    const openImagePicker = () => {
        const options = {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
        };
    
        launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('Image picker error: ', response.error);
          } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            console.log(imageUri)
            if (onSelectedImage){
               onSelectedImage(imageUri);
            }
            setSelectedImage(imageUri);
          }
        });
      };
  
    const  handleCameraLaunch = () => {
        const options = {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
        };
      
        launchCamera(options, response => {
          if (response.didCancel) {
            console.log('User cancelled camera');
          } else if (response.error) {
            console.log('Camera Error: ', response.error);
          } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            setSelectedImage(imageUri);
            console.log(imageUri);
          }
        });
      }

    return (
        <View style={{flexDirection: 'row', paddingVertical: 10, gap:5}}>
            <Image style={{width:90, height:90}} 
                source={ image? {uri : image } : require("../../assets/images/no-image.png") }
            />
            <View style={{justifyContent: 'space-between'}}>
                <ThemedButton style={{paddingVertical: 6}} bg={'primaryColor'} title="Elija una foto" onPress={openImagePicker} />
                <ThemedButton style={{paddingVertical: 6}} bg={'primaryColor'} title="Tome una foto" onPress={handleCameraLaunch} />    
            </View>
      </View>
    )
}
export default  memo(TakePhoto);