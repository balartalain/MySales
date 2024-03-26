import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
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
  TouchableWithoutFeedback,
} from 'react-native';
import { Dimensions } from 'react-native';
import { useFocus } from '../hooks/useFocus';
import ShoppingCart from './ShoppingCart';
const windowHeight = Dimensions.get('window').height;
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const isPointWithinArea = (
  pointX, // x coordinate
  pointY, // y coordinate
  areaTlX, // top left x coordinate
  areaTlY, // top left y coordinate
  areaBrX, // bottom right x coordinate
  areaBrY, // bottom right y coordinate
) => {
  return (
    areaTlX <= pointX &&
    pointX <= areaBrX && // is within horizontal axis
    areaTlY <= pointY &&
    pointY <= areaBrY
  ); // is within vertical axis
};

// Moves an object within a given array from one position to another
const moveArrayElement = (
  array, // array of objects
  from, // element to move index
  to, // index where to move
) => {
  [array[from], array[to]] = [array[to], array[from]];
  return [...array];
};

let itemBeingDragged;
let lastDraggedOverItem;
let currentDraggedOverItem;
let scrollY = 0;
let offsetScrollY = 0;
let scrollViewInitDrag = false;

/* eslint-disable react/display-name */
const SortableList = forwardRef(
  ({ _data, scrollTo, itemStyle = {}, textStyle = {}, onSwapItems = () => {} }, ref) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const itemRefs = useRef([]);
    const [data, setData] = useState([]);
    const dataRef = useRef([]);
    const [allowDragging, setAllowDragging] = useState(false);
    const allowDraggingRef = useRef();
    allowDraggingRef.current = allowDragging;
    const scrollRef = React.useRef();
    const { isFocused } = useFocus();

    React.useEffect(() => {
      itemBeingDragged = lastDraggedOverItem = currentDraggedOverItem = null;
      scrollY = 0;
      offsetScrollY = 0;
      scrollViewInitDrag = false;
    }, []);

    React.useEffect(() => {
      if (isFocused) {
        itemBeingDragged = lastDraggedOverItem = currentDraggedOverItem = null;
        scrollY = 0;
        offsetScrollY = 0;
        scrollViewInitDrag = false;
      }
    }, [isFocused]);
    React.useEffect(() => {
      setData(_data.map((label, id) => ({ id, label })));
    }, [_data]);

    React.useEffect(() => {
      dataRef.current = data;
    }, [data]);

    //   React.useEffect(() => {
    //     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    //   }, []);
    const panResponder = PanResponder.create({
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
          if (currentDraggedOverItem && lastDraggedOverItem?.id !== currentDraggedOverItem.id) {
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
    });
    useImperativeHandle(ref, () => ({
      scroll: (offsetY) => {
        scrollRef.current.scrollTo({ y: offsetY, animated: true });
      },
    }));
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
      if (scrollViewInitDrag) {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Scroll al mismo offset en el segundo ScrollView
        //scrollOuterRef.current.scrollTo({ y: offsety, animated: false });
        scrollTo(offsetY);
      }
      offsetScrollY = scrollY;
    };
    const onScrollBeginDrag = () => {
      scrollViewInitDrag = true;
    };
    const onScrollEndDrag = () => {
      scrollViewInitDrag = false;
    };
    const completeMeasure = (count) => {
      if (count === itemRefs.current.length - 1) {
        setData([...data]);
      }
    };
    const measure = (i) => {
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
          if (i === 0) {
            console.log(data[i]);
          }
        });
      }, 300);
    };
    const onLayout = ({ nativeEvent, i }) => {
      if (i === 1) {
        console.log(nativeEvent.layout);
      }
      measure(i);
    };
    const findItemAtCoordinates = (x, y, exceptItem) => {
      const it = dataRef.current.find(
        (item) =>
          isPointWithinArea(x, y, item.tlX, item.tlY, item.brX, item.brY) &&
          (!exceptItem || exceptItem.id !== item.id),
      );
      // console.log(`mouseX: ${x} - mouseY: ${y}`);
      // console.log(
      //   `tlX: ${dataRef.current[0].tlX} - tlY: ${dataRef.current[0].tlY} - width: ${dataRef.current[0].brX} - height: ${dataRef.current[0].brY}`,
      // );
      return it;
    };
    const updateItemState = (item, props) => {
      console.log('Update item');
      const index = dataRef.current.findIndex(({ id }) => id === item.id);
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
      const draggedItemIndex = dataRef.current.findIndex(({ id }) => id === draggedItem.id);
      const anotherItemIndex = dataRef.current.findIndex(({ id }) => id === anotherItem.id);
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
      onSwapItems(draggedItemIndex, anotherItemIndex);
      // setDndEnabled(false);
      // enableDndAfterAnimating();
    };
    const onLongPress = (e) => {
      const { pageX, pageY } = e.nativeEvent;
      data.forEach((item, i) => measure(i));
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
    console.log(data[0]);
    return (
      <View style={styles.container} {...panResponder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          scrollEnabled={!allowDragging}
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
        >
          {data.map((item, i) => (
            <TouchableOpacity
              key={i}
              onLongPress={onLongPress}
              onPressOut={onPressOut}
              ref={(element) => itemRefs.current.push(element)}
              onLayout={({ nativeEvent }) => onLayout({ nativeEvent, i })}
              style={[
                { transform: item.transform ? item.transform : [{ scale: 1 }, { translateY: 0 }] },
                { ...styles.box },
                // eslint-disable-next-line react-native/no-inline-styles
                { backgroundColor: i % 2 === 0 ? '#f9f9f9' : undefined },
                styles[item.cls],
              ]}
            >
              <Animated.View>
                <Text style={textStyle}>{item.label}</Text>
              </Animated.View>
            </TouchableOpacity>
            /*<DraggableView key={i} backgroundColor={i % 2 === 0 ? '#61dafb' : 'green'} />*/
          ))}
        </ScrollView>
      </View>
    );
  },
);
export default SortableList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    //width: 200,
    //height: 100,
    //borderRadius: 4,
    //padding: 10,
    //margin: 5,
    //backgroundColor: 'gray',
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
    transform: [{ scale: 1.2 }, { translateY: 0 }],
    zIndex: 1,
    elevation: 0,
  },
  lastItemOver: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    transform: [{ scale: 1 }, { translateY: 0 }],
    zIndex: 1,
    elevation: 0,
  },
});
