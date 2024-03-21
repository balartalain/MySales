import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Display from '../components/Display';
import ProductList from '../components/ProductList';
import { ThemedButton, TText } from '../components/ThemedComponents';
import POS from '../DAL/Pos';
import { useFocus } from '../hooks/useFocus';

const data = [];
const headers = ['Producto', 'Cant. Inicial', 'Cant. Vendida', 'Existencia', 'Total'];

const IPV = ({ data1, headers1 }) => {
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
  return (
    <View style={styles.container}>
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
          {[...Array(30)].map((e, index) => (
            <View key={index} style={{ backgroundColor: index % 2 == 0 ? '#f9f9f9' : undefined }}>
              <Text style={[styles.textLeftCell, { color: 'red' }]}>{index}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.grid}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* inner grid - horizontal scroll */}
          <View>
            <View style={{ flexDirection: 'row' }}>
              {headers.map((h, i) => (
                <View style={styles.headerItem} key={i}>
                  <Text style={styles.headerItemText}>{h}</Text>
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
                {[...Array(30)].map((_, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: index % 2 == 0 ? '#f9f9f9' : undefined,
                    }}
                  >
                    {[1, 2, 3, 4].splice(1).map((h, i) => (
                      <View style={styles.containerCell} key={i}>
                        <Text style={styles.textCell}>{h}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    textAlign: 'center',
  },
});
export default IPV;
