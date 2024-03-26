import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { isPointWithinArea, moveArrayElement } from './DraggerUtils';
import { Dimensions } from 'react-native';
import { scrollTo } from 'react-native-reanimated';
const windowHeight = Dimensions.get('window').height;
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const ListItem = () => {
//   const ref = useRef();
//   const onLayout = () => {
//     if (ref.current) {
//       ref.current.measure(this.onMeasure);
//     }
//   };
//   return (
//     <View ref={ref}>
//       <Text>ABD</Text>
//     </View>
//   );
// };
let itemBeingDragged;
let lastDraggedOverItem;
let currentDraggedOverItem;
let scrollY = 0;
let offsetScrollY = 0;
const DraggableArea = ({ _data }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const itemRefs = useRef([]);
  const [data, setData] = useState([]);
  const dataRef = useRef([]);
  const [allowDragging, setAllowDragging] = useState(false);
  const allowDraggingRef = useRef();
  allowDraggingRef.current = allowDragging;
  const scrollRef = React.useRef();
  //const [bgColors, setBgColors] = useState([]);

  React.useEffect(() => {
    setData(_data);
  }, [_data]);

  React.useEffect(() => {
    dataRef.current = data;
  }, [data]);

  //   React.useEffect(() => {
  //     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  //   }, []);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const { dx, dy, moveX, moveY, numberActiveTouches } = gestureState;

        if (!allowDraggingRef.current) {
          return false;
        }
        // Do not set pan responder if a multi touch gesture is occurring
        if (numberActiveTouches !== 1) {
          return false;
        }

        // or if there was no movement since the gesture started
        if (dx === 0 && dy === 0) {
          return false;
        }
        // Find the tag below user's finger at given coordinates
        const item = findItemAtCoordinates(moveX, moveY);
        if (item) {
          // assign it to `this.tagBeingDragged` while dragging
          itemBeingDragged = item;
          //setItemDragging(item);
          // and tell PanResponder to start handling the gesture by calling `onPanResponderMove`
          return true;
        }

        return false;
      },
      onPanResponderGrant: (e, gestureState) => {
        if (itemBeingDragged) {
          const offsetY = 0; /*itemBeingDragged.relativeY*/
          pan.setOffset({
            y: offsetY,
          });
          pan.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderEnd: () => {
        if (itemBeingDragged) {
          updateItemState(itemBeingDragged, { isBeingDragged: false, cls: 'lastItemOver' });
          //setItemDragging(undefined);
        }
        if (lastDraggedOverItem) {
          updateItemState(lastDraggedOverItem, { isBeingDragged: false, cls: 'lastItemOver' });
        }
        if (currentDraggedOverItem) {
          updateItemState(currentDraggedOverItem, { isBeingDragged: false, cls: 'lastItemOver' });
        }
        if (itemBeingDragged != null && currentDraggedOverItem != null) {
          swapItems(itemBeingDragged, currentDraggedOverItem);
        }
        itemBeingDragged = lastDraggedOverItem = lastDraggedOverItem = null;
        setAllowDragging((e) => false);
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
        listener: (evt) => {
          const { pageX, pageY } = evt.nativeEvent;
          if (itemBeingDragged) {
            updateItemState(itemBeingDragged, {
              transform: [{ scale: 1.1 }, { translateY: pan.y }],
            });
          }
          let neededUpdate = false;
          currentDraggedOverItem = findItemAtCoordinates(pageX, pageY, itemBeingDragged);
          if (currentDraggedOverItem && lastDraggedOverItem?.code !== currentDraggedOverItem.code) {
            neededUpdate = true;
          }
          if (!currentDraggedOverItem && lastDraggedOverItem) {
            neededUpdate = true;
          }
          if (neededUpdate) {
            if (currentDraggedOverItem) {
              updateItemState(currentDraggedOverItem, {
                cls: 'currItemOver',
              });
            }
            if (lastDraggedOverItem) {
              updateItemState(lastDraggedOverItem, { cls: 'lastItemOver' });
            }
          }
          lastDraggedOverItem = currentDraggedOverItem;
        },
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  const onScroll = (event) => {
    scrollY = event.nativeEvent.contentOffset.y;
    setData(
      data.map((item) => {
        return {
          ...item,
          tlY: item.tlY - scrollY + offsetScrollY,
          brY: item.tlY - scrollY + offsetScrollY + item.height,
        };
      }),
    );
    offsetScrollY = scrollY;
  };
  const onLayout = ({ nativeEvent, i }) => {
    setTimeout(() => {
      //data[i].relativeX = nativeEvent.layout.x;
      //data[i].relativeY = nativeEvent.layout.y;
      itemRefs.current[i].measure((x, y, width, height, screenX, screenY) => {
        data[i].tlX = screenX;
        data[i].tlY = screenY;
        data[i].brX = screenX + width;
        data[i].brY = screenY + height;
        data[i].width = width;
        data[i].height = height;
        data[i].dndEnabled = true;
      });
    }, 300);
  };
  const findItemAtCoordinates = (x, y, exceptItem) => {
    const it = dataRef.current.find(
      (item) =>
        item.tlX &&
        item.tlY &&
        item.brX &&
        item.brY &&
        isPointWithinArea(x, y, item.tlX, item.tlY, item.brX, item.brY) &&
        (!exceptItem || exceptItem.code !== item.code),
    );
    //console.log(`mouseX: ${x} - mouseY: ${y}`);
    //console.log(data[0].tlY, data[0].brY);
    // console.log(
    //   `tlX: ${dataRef.current[0].tlX} - tlY: ${dataRef.current[0].tlY} - ${dataRef.current[0].brY}`,
    // );
    return it;
  };
  const updateItemState = (item, props) => {
    console.log('Update item');
    const index = dataRef.current.findIndex(({ code }) => code === item.code);
    setData((d) => [
      ...d.slice(0, index),
      {
        ...d[index],
        ...props,
      },
      ...d.slice(index + 1),
    ]);
  };
  const swapItems = (draggedItem, anotherItem) => {
    const draggedItemIndex = dataRef.current.findIndex(({ code }) => code === draggedItem.code);
    const anotherItemIndex = dataRef.current.findIndex(({ code }) => code === anotherItem.code);
    setData((d) => {
      const dd = moveArrayElement(d, draggedItemIndex, anotherItemIndex);
      const attrs = {
        tlX: dd[draggedItemIndex].tlX,
        tlY: dd[draggedItemIndex].tlY,
        width: dd[draggedItemIndex].width,
        height: dd[draggedItemIndex].height,
      };
      dd[draggedItemIndex].tlX = dd[anotherItemIndex].tlX;
      dd[draggedItemIndex].tlY = dd[anotherItemIndex].tlY;
      dd[draggedItemIndex].brX = dd[anotherItemIndex].tlX + dd[anotherItemIndex].width;
      dd[draggedItemIndex].brY = dd[anotherItemIndex].tlY + dd[anotherItemIndex].height;

      dd[anotherItemIndex].tlX = attrs.tlX;
      dd[anotherItemIndex].tlY = attrs.tlY;
      dd[anotherItemIndex].brX = attrs.tlX + attrs.width;
      dd[anotherItemIndex].brY = attrs.tlY + attrs.height;
      return dd;
    });
    // setDndEnabled(false);
    // enableDndAfterAnimating();
  };
  const onLongPress = (e) => {
    const { pageX, pageY } = e.nativeEvent;
    const item = findItemAtCoordinates(pageX, pageY);
    if (item) {
      updateItemState(item, {
        isBeingDragged: true,
        transform: [{ scale: 1.1 }, { translateY: 0 }],
        cls: 'itemDragged',
      });
    }
    setAllowDragging(true);
  };
  const onPressOut = (e) => {
    const { pageX, pageY } = e.nativeEvent;
    if (!itemBeingDragged) {
      const item = findItemAtCoordinates(pageX, pageY);
      if (allowDragging && item) {
        updateItemState(item, {
          isBeingDragged: false,
          cls: 'lastItemOver',
        });
      }
      setAllowDragging(false);
    }
  };
  return (
    <View {...panResponder.panHandlers}>
      <ScrollView ref={scrollRef} scrollEnabled={!allowDragging} onScroll={onScroll}>
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
            ref={(element) => itemRefs.current.push(element)}
            onLayout={({ nativeEvent }) => onLayout({ nativeEvent, i })}
            style={[
              { transform: item.transform ? item.transform : [{ scale: 1 }, { translateY: 0 }] },
              styles.box,
              styles[item.cls],
            ]}
          >
            <Animated.View>
              <Text>{item.name}</Text>
              <Text style={{ fontSize: 18 }}>tlY: {parseInt(item.tlY)}</Text>
              <Text style={{ fontSize: 18 }}>brY: {parseInt(item.brY)}</Text>
            </Animated.View>
          </TouchableOpacity>
          /*<DraggableView key={i} backgroundColor={i % 2 === 0 ? '#61dafb' : 'green'} />*/
        ))}
      </ScrollView>
    </View>
  );
};
const data = [
  { code: '0001', name: 'Refresco', price: 120 },
  { code: '0002', name: 'Cerveza', price: 120 },
  { code: '00df02', name: 'Malta', price: 120 },
  { code: '00e0df1', name: 'Refresco', price: 120 },
  { code: '0dfdf002', name: 'Cerveza', price: 120 },
  { code: '00de40df1', name: 'Refresco', price: 120 },
  { code: '00sdf02', name: 'Cerveza', price: 120 },
  { code: '0sd001', name: 'Refresco', price: 120 },
  { code: '00sda02', name: 'Cerveza', price: 120 },
];
const Draggable = () => {
  return (
    <View style={styles.container}>
      <DraggableArea _data={data} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center',
  },
  box: {
    width: 200,
    height: 100,
    //borderRadius: 4,
    padding: 10,
    margin: 10,
    backgroundColor: 'gray',
    /*position: 'absolute',*/
  },
  itemDragged: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: 'yellow',
    //transform: [{ scale: 0.9 }],
    zIndex: 2,
    elevation: 9,
  },
  currItemOver: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: 'red',
    transform: [{ scale: 1.15 }, { translateY: 0 }],
    zIndex: 1,
    elevation: 0,
  },
  lastItemOver: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: 'gray',
    transform: [{ scale: 1 }, { translateY: 0 }],
    zIndex: 1,
    elevation: 0,
  },
});
export default Draggable;
