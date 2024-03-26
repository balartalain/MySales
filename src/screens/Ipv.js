import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { useProduct } from '../ProductProvider';
import Display from '../components/Display';
import ProductList from '../components/ProductList';
import { ThemedButton, TText } from '../components/ThemedComponents';
import POS from '../DAL/Pos';
import { useFocus } from '../hooks/useFocus';
import { SortableList } from './Animations';

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
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
      }}
    >
      {columns.map((col, i) => (
        <View style={styles.containerCell} key={i}>
          <Text style={styles.textCell}>{product[col.name] || 0}</Text>
        </View>
      ))}
    </View>
  );
};
const IPV = () => {
  const productsRef = React.useRef();
  const { products, setProducts } = useProduct();
  //const [productsSorted, setProductsSorted] = React.useState([]);
  const [ipv, setIPV] = React.useState([]);
  const [existTurn, setExistTurn] = React.useState(true);
  const [scrollTo, setScrollTo] = React.useState(0);
  const scrollInnerRef = React.useRef();
  const offsetYRef = React.useRef(0);
  const [startingScroll, setStartingScroll] = React.useState('no-child');
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
    productsRef.current = products;
  }, [products]);
  React.useEffect(() => {
    const dd = Array.from(Array(12), (_, i) => ({ name: i, initialQty: i, order: i }));
    setProducts(dd);
  }, [setProducts]);

  React.useEffect(() => {
    fillIPV();
  }, [fillIPV]);

  // Función para sincronizar el desplazamiento
  const handleInnerScrollView = (event) => {
    if (startingScroll !== 'child') {
      const offsety = event.nativeEvent.contentOffset.y;
      setScrollTo(offsety);
      offsetYRef.current = offsety;
    }
  };
  const onChildScrollTo = (offsetY) => {
    setStartingScroll('child');
    scrollInnerRef.current.scrollTo({ y: offsetY, animated: false });
    //setScrollTo(offsetY);
    offsetYRef.current = offsetY;
  };
  const onScrollBeginDrag = () => {
    setStartingScroll('no-child');
  };
  const onSwapItems = (from, to) => {
    const order = products[to].order;
    products[to].order = products[from].order;
    products[from].order = order;
    setProducts([...products]);
    console.log(products);
  };
  if (!existTurn) {
    return (
      <View>
        <Text>Tiene que abrir el turno.</Text>
      </View>
    );
  }

  const productNames = products.flatMap((e) => e.name);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={styles.leftColumn}>
          <View style={[styles.headerItem, { width: 130 }]}>
            <Text style={styles.headerItemText}>Producto</Text>
          </View>
          <SortableList
            scrollTo={scrollTo}
            startingScroll={startingScroll}
            onScrollTo={onChildScrollTo}
            data={productNames}
            onSwapItems={onSwapItems}
            textStyle={styles.textLeftCell}
            oddBgColor="#f9f9f9"
          />
          {/* left scroll view to simulate fixed first column */}
          {/*<ScrollView
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
            */}
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
                onScrollBeginDrag={onScrollBeginDrag}
              >
                <View>
                  {products.map((p, index) => (
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
    //height: '100%',
    //backgroundColor: 'green',
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
