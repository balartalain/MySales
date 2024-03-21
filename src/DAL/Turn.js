import AsyncStorage from '@react-native-async-storage/async-storage';

const turn = {
  get: async function () {
    //await AsyncStorage.removeItem('turn');
    let t = await AsyncStorage.getItem('turn');
    return !t ? null : JSON.parse(t);
  },
  save: async function (obj) {
    await AsyncStorage.setItem('turn', JSON.stringify(obj));
  },
  saveIPV: async function (ipvObj) {
    let t = await AsyncStorage.getItem('turn');
    if (!t) {
      return;
    }
    t.ipv = ipvObj;
    await this.save(t);
  },
  getIPV: async function () {
    const t = await this.get();
    return t.ipv;
  },
  close: async function () {
    //TODO:Agregar la fecha final al turno
    await AsyncStorage.removeItem('turn');
    await AsyncStorage.removeItem('ipv');
    await AsyncStorage.removeItem('ticket');
  },
};
export default turn;
