import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { useProduct } from '../ProductProvider';
import Display from '../components/Display';
import ProductList from '../components/ProductList';
import { ThemedButton, TText } from '../components/ThemedComponents';
import POS from '../DAL/Pos';
import { useFocus } from '../hooks/useFocus';

const columns = [
  {
    name: 'initialQty',
    label: 'Cant. Inicial',
  },
  {
    name: 'soldQty',
    label: 'Cant. Vendida',
  },
  { name: 'inStock', label: 'Existencia' },
  { name: 'monto', label: 'Monto' },
  { name: 'blank', label: '' },
];

const RenderRow = ({ product, index }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: index % 2 == 0 ? '#f9f9f9' : 'undefined',
      }}
    >
      {columns.map((col, i) => (
        <View style={styles.containerCell} key={i}>
          <Text style={styles.textCell}>{product[col.name]}</Text>
        </View>
      ))}
    </View>
  );
};
const IPV = () => {
  const { products } = useProduct();
  //const [productsSorted, setProductsSorted] = React.useState([]);
  const [ipv, setIPV] = React.useState([]);
  const [existTurn, setExistTurn] = React.useState(true);
  //console.log('AASASASAS ' + (await POS.turn.getIPV()));
  const fillIPV = React.useCallback(async () => {
    const productSorted = products.sort((a, b) => a.order - b.order);
    if (!(await POS.turn.get())) {
      setExistTurn(false);
      return;
    }
    let _ipv = await POS.turn.getIPV();
    if (!_ipv) {
      _ipv = productSorted.map((p) => ({
        code: p.code,
        name: p.name,
        initialQty: 0,
        soldQty: 0,
        inStock: 0,
        monto: 0,
      }));
    }
    setIPV(_ipv);
  }, [products]);
  React.useEffect(() => {
    fillIPV();
  }, [fillIPV]);

  const scrollOuterRef = React.useRef();
  const scrollInnerRef = React.useRef();
  let scrollViewInitDrag;
  // Función para sincronizar el desplazamiento
  const handleInnerScrollView = (event) => {
    if (scrollViewInitDrag === 'inner') {
      const offsety = event.nativeEvent.contentOffset.y;
      // Scroll al mismo offset en el segundo ScrollView
      scrollOuterRef.current.scrollTo({ y: offsety, animated: false });
    }
  };
  const handleOuterScrollView = (event) => {
    if (scrollViewInitDrag !== 'inner') {
      const offsety = event.nativeEvent.contentOffset.y;
      //console.log('handleOuterScrollView');
      scrollInnerRef.current.scrollTo({ y: offsety, animated: false });
    }
  };
  const onScrollBeginDrag = (scrollView) => {
    scrollViewInitDrag = scrollView;
  };
  const onScrollEndDrag = () => {
    scrollViewInitDrag = null;
  };

  const productNames = products.map((p) => p.name);

  if (!existTurn) {
    return (
      <View>
        <Text>Tiene que abrir el turno.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.leftColumn}>
          <View style={[styles.headerItem, { width: 130 }]}>
            <Text style={styles.headerItemText}>Producto</Text>
          </View>
          {/* left scroll view to simulate fixed first column */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollOuterRef}
            onScroll={handleOuterScrollView}
            scrollEventThrottle={8}
            onScrollBeginDrag={() => onScrollBeginDrag('outer')}
            onScrollEndDrag={onScrollEndDrag}
          >
            {productNames.map((name, index) => (
              <View key={index} style={{ backgroundColor: index % 2 == 0 ? '#f9f9f9' : undefined }}>
                <Text style={[styles.textLeftCell]}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.grid}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* inner grid  */}
            <View>
              <View style={{ flexDirection: 'row' }}>
                {columns.map((col, i) => (
                  <View style={styles.headerItem} key={i}>
                    <Text style={styles.headerItemText}>{col.label}</Text>
                  </View>
                ))}
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                ref={scrollInnerRef}
                onScroll={handleInnerScrollView}
                scrollEventThrottle={8}
                onScrollBeginDrag={() => onScrollBeginDrag('inner')}
                onScrollEndDrag={onScrollEndDrag}
              >
                <View>
                  {ipv.map((p, index) => (
                    <RenderRow product={p} key={index} index={index} />
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
      <View>
        <ThemedButton
          //onPress={openTurn}
          style={{ alignSelf: 'center' }}
          bg="secondaryColor"
          title="Continuar"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  leftColumn: {
    width: 130,
  },
  headerItem: {
    width: 120,
    backgroundColor: 'yellow',
  },
  headerItemText: {
    paddingVertical: 16,
    borderLeftWidth: 1,
    textAlign: 'center',
  },
  textCell: {
    paddingVertical: 15,
    textAlign: 'center',
  },
  containerCell: {
    width: 120,
  },
  textLeftCell: {
    paddingVertical: 15,
    paddingLeft: 15,
    textAlign: 'left',
  },
  grid: {},
});
export default IPV;
