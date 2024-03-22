import AsyncStorage from '@react-native-async-storage/async-storage';
// class Ipv {
//   constructor(json) {
//     this.id = 1111; //generate id
//     this.turn = turn;
//   }
//   toJSON() {
//     return {
//       code: this.code,
//       inicialQty: this.inicialQty,
//       soldQty: this.soldQty,
//       inStock: this.inStock,
//       monto: this.monto,
//     };
//   }
//   static save() {}
// }
const IPV = {
  //core,
  //inicialQty,
  //soldQty,
  //inStock
  //monto
};
const turn = {
  get: async function () {
    let t = await AsyncStorage.getItem('turn');
    return !t ? null : JSON.parse(t);
  },
  save: async function (obj) {
    await AsyncStorage.setItem('turn', JSON.stringify(obj));
  },
  saveIPV: async function (obj) {
    const t = await this.get();
    if (!t) {
      return;
    }
    obj.turnId = t.id;
    t.ipv = obj;
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
