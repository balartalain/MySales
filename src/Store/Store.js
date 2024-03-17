import AsyncStorage from '@react-native-async-storage/async-storage';
// export class Store {
//   static instance;
//   turn;
//   constructor() {}
//   static getInstance() {
//     if (!Store.instance) {
//       Store.instance = new Store();
//     }
//     return Store.instance;
//   }
// }

const Store = {
  newObject: async function (key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log('Error: ', e);
    }
  },
  getObject: async function (key) {
    try {
      return JSON.parse(await AsyncStorage.getItem(key));
    } catch (e) {
      console.log('Error: ', e);
    }
  },
  saveObject: async function (key, data) {
    try {
      let object = await AsyncStorage.getItem(key);
      if (object) {
        object = JSON.parse(object);
      }
      object = { ...object, ...data };
      await AsyncStorage.setItem(key, JSON.stringify(object));
    } catch (e) {
      console.log('Error: ', e);
    }
  },
};
export default Store;
