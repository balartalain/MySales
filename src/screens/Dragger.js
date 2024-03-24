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
} from 'react-native';
import { isPointWithinArea, moveArrayElement } from './DraggerUtils';
import { ScrollView } from 'react-native-gesture-handler';

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
const ITEM_SORT_ACTIVE = 1.06;
const SCALE_DURATION = 200;

let itemBeingDragged;
let lastDraggedOverItem;
let currentDraggedOverItem;
let scrollY = 0;
const DraggableArea = ({ _data }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const itemRefs = useRef([]);
  const [data, setData] = useState([]);
  const dataRef = useRef([]);
  const [allowDragging, setAllowDragging] = useState(false);
  const allowDraggingRef = useRef();
  allowDraggingRef.current = allowDragging;
  const [dndEnabled, setDndEnabled] = useState();
  const scaleValue = React.useRef(new Animated.Value(1)).current;
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
  const onScroll = (event) => {
    scrollY = event.nativeEvent.contentOffset.y;
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const { dx, dy, moveX, moveY, numberActiveTouches } = gestureState;
        console.log(allowDraggingRef.current);
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
          updateItemState(itemBeingDragged, { isBeingDragged: true });
          //console.log(pan);
        }
      },
      onPanResponderEnd: () => {
        if (itemBeingDragged) {
          updateItemState(
            itemBeingDragged,
            { isBeingDragged: false },
            { backgroundColor: 'gray', transform: [{ scale: 1 }], zIndex: 1, elevation: 0 },
          );
          //setItemDragging(undefined);
        }
        if (lastDraggedOverItem) {
          updateItemState(
            lastDraggedOverItem,
            { isBeingDragged: false },
            { backgroundColor: 'gray' },
          );
        }
        if (currentDraggedOverItem) {
          updateItemState(
            currentDraggedOverItem,
            { isBeingDragged: false },
            { backgroundColor: 'gray' },
          );
        }
        itemBeingDragged = lastDraggedOverItem = lastDraggedOverItem = undefined;
        setAllowDragging((e) => false);
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
        listener: (evt) => {
          const { pageX, pageY } = evt.nativeEvent;
          if (itemBeingDragged) {
            updateItemState(itemBeingDragged, {}, { transform: [{ translateY: pan.y }] });
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
              updateItemState(
                currentDraggedOverItem,
                { isBeingDragged: false },
                {
                  backgroundColor: 'red',
                },
              );
            }
            if (lastDraggedOverItem) {
              updateItemState(
                lastDraggedOverItem,
                {},
                {
                  backgroundColor: 'gray',
                },
              );
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
  // Enable dnd back after the animation is over
  const enableDndAfterAnimating = () => {
    //setTimeout(enableDnd, animationDuration);
  };
  const enableDnd = () => {
    setDndEnabled(true);
  };
  const onLayout = ({ nativeEvent, i }) => {
    setTimeout(() => {
      data[i].relativeX = nativeEvent.layout.x;
      data[i].relativeY = nativeEvent.layout.y;
      itemRefs.current[i].measure((x, y, width, height, screenX, screenY) => {
        data[i].tlX = screenX;
        data[i].tlY = screenY;
        data[i].brX = screenX + width;
        data[i].brY = screenY + height;
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
        isPointWithinArea(x, y + scrollY, item.tlX, item.tlY, item.brX, item.brY) &&
        (!exceptItem || exceptItem.code !== item.code),
    );
    // console.log(`mouseX: ${x} - mouseY: ${y}`);
    // console.log(`tlX: ${data[0].tlX} - tlY: ${data[0].tlY}`);
    return it;
  };
  const updateItemState = (item, { isBeingDragged }, styles) => {
    console.log('Update item');
    const index = dataRef.current.findIndex(({ code }) => code === item.code);
    setData((d) => [
      ...d.slice(0, index),
      {
        ...d[index],
        isBeingDragged,
        styles: { ...d[index].styles, ...styles },
      },
      ...d.slice(index + 1),
    ]);
  };
  const swapTags = (draggedItem, anotherItem) => {
    const draggedItemIndex = data.findIndex(({ code }) => code === draggedItem.code);
    const anotherItemIndex = data.findIndex(({ code }) => code === anotherItem.code);
    setData(moveArrayElement(data, draggedItemIndex, anotherItemIndex));
    setDndEnabled(false);
    enableDndAfterAnimating();
  };
  const onLongPress = (e) => {
    const { pageX, pageY } = e.nativeEvent;
    const item = findItemAtCoordinates(pageX, pageY);
    if (item) {
      updateItemState(
        item,
        { isBeingDragged: true },
        { backgroundColor: 'yellow', transform: [{ scale: 0.9 }], zIndex: 2, elevation: 9 },
      );
    }
    setAllowDragging(true);
  };
  const onPressOut = () => {
    if (!itemBeingDragged) {
      setAllowDragging(false);
    }
  };
  return (
    <ScrollView scrollEnabled={!allowDragging} onScroll={onScroll}>
      <View {...panResponder.panHandlers}>
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
            ref={(element) => itemRefs.current.push(element)}
            onLayout={({ nativeEvent }) => onLayout({ nativeEvent, i })}
            style={[styles.box, item.styles]}
          >
            <Animated.View>
              <Text>{item.name}</Text>
              <Text>{item.isBeingDragged ? 'TRUE' : 'FALSE'}</Text>
            </Animated.View>
          </TouchableOpacity>
          /*<DraggableView key={i} backgroundColor={i % 2 === 0 ? '#61dafb' : 'green'} />*/
        ))}
        {/*itemBeingDragged && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: pan.y,
              },
              styles.box,
              { backgroundColor: 'gray', elevation: 9 },
            ]}
          >
            <Text>{itemBeingDragged.name}</Text>
          </Animated.View>
          )*/}
      </View>
    </ScrollView>
  );
};
const data = [
  { code: '0001', name: 'Refresco', price: 120 },
  { code: '0002', name: 'Cerveza', price: 120 },
  { code: '0003', name: 'Malta', price: 120 },
  { code: '0004', name: 'Cola', price: 120 },
  { code: '50er001', name: 'Refresco', price: 120 },
  { code: '06557er002', name: 'Cerveza', price: 120 },
  { code: '0e78567r003', name: 'Malta', price: 120 },
  { code: '06e67r004', name: 'Cola', price: 120 },
  { code: '065745001', name: 'Refresco', price: 120 },
  { code: '0677wer002', name: 'Cerveza', price: 120 },
  { code: '089056303', name: 'Malta', price: 120 },
  { code: '003404', name: 'Cola', price: 120 },
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
    width: 80,
    height: 80,
    //borderRadius: 4,
    padding: 10,
    margin: 10,
    backgroundColor: 'gray',
    /*position: 'absolute',*/
  },
  cloneBox: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    transform: [{ scale: 1.1 }],
  },
});
export default Draggable;
