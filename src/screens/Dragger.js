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
} from 'react-native';
import { isPointWithinArea, moveArrayElement } from './DraggerUtils';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
const DraggableArea = ({ _data }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const itemRefs = useRef([]);
  const [data, setData] = useState([]);
  const dataRef = useRef([]);
  const [dndEnabled, setDndEnabled] = useState();
  const animationDuration = 250;
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
        //console.log(gestureState);
        if (itemBeingDragged) {
          updateItemState(itemBeingDragged, { isBeingDragged: true, bgColor: 'yellow' });
          //console.log(pan);
        }
      },
      //   onPanResponderGrant: (evt, gestureState) => {
      //     //console.log(gestureState.moveY);
      //     pan.setOffset({
      //       y: pan.y._value,
      //     });
      //     //pan.setValue({ y: 0 });
      //   },
      onPanResponderEnd: () => {
        if (itemBeingDragged) {
          updateItemState(itemBeingDragged, { isBeingDragged: false, bgColor: undefined });
          //setItemDragging(undefined);
        }
        if (lastDraggedOverItem) {
          updateItemState(lastDraggedOverItem, { bgColor: undefined });
        }
        if (currentDraggedOverItem) {
          updateItemState(currentDraggedOverItem, { bgColor: undefined });
        }
        itemBeingDragged = lastDraggedOverItem = lastDraggedOverItem = undefined;
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
        listener: (evt) => {
          const { pageX, pageY } = evt.nativeEvent;
          let neededUpdate = false;
          currentDraggedOverItem = findItemAtCoordinates(pageX, pageY, itemBeingDragged);
          if (currentDraggedOverItem && lastDraggedOverItem !== currentDraggedOverItem) {
            //updateItemState(currentDraggedOverItem, { bgColor: 'red' });
            console.log('Caso 1');
            neededUpdate = true;
          }
          if (!currentDraggedOverItem && lastDraggedOverItem) {
            neededUpdate = true;
          }
          if (neededUpdate) {
            if (currentDraggedOverItem) {
              updateItemState(currentDraggedOverItem, { bgColor: 'red' });
            }
            if (lastDraggedOverItem) {
              //updateItemState(lastDraggedOverItem, { bgColor: undefined });
            }
          }
          lastDraggedOverItem = currentDraggedOverItem;
        },
      }),
      // onPanResponderMove: (evt, gestureState) => {
      //   const { moveX, moveY } = gestureState;
      //   // Do nothing if dnd is disabled
      //   // if (!this.state.dndEnabled) {
      //   //   return;
      //   // }
      //   // Find the tag we're dragging the current tag over
      //   newDraggedOverItem = findItemAtCoordinates(moveX, moveY, itemBeingDragged);
      //   if (
      //     newDraggedOverItem &&
      //     (!draggedOverItem || draggedOverItem.code !== newDraggedOverItem.code)
      //   ) {
      //     updateItemState(newDraggedOverItem, { bgColor: 'red' });
      //     if (draggedOverItem) {
      //       updateItemState(draggedOverItem, { bgColor: undefined });
      //     }
      //     draggedOverItem = newDraggedOverItem;
      //     //this.swapTags(this.tagBeingDragged, draggedOverTag);
      //   }
      // },
      // onPanResponderMove: Animated.event([null, { dy: pan.y }], {
      //   useNativeDriver: false,
      //   listener: (evt) => {
      //     const { pageX, pageY } = evt.nativeEvent;
      //   },
      // }),
      //   onPanResponderMove: (evt, gestureState) => {
      //     Animated.event([{ y: pan.y }])({ y: gestureState.moveY });
      //   },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;
  // Enable dnd back after the animation is over
  const enableDndAfterAnimating = () => {
    setTimeout(enableDnd, animationDuration);
  };
  const enableDnd = () => {
    setDndEnabled(true);
  };
  const onLayout = ({ nativeEvent, i }) => {
    itemRefs.current[i].measure((x, y, width, height, screenX, screenY) => {
      data[i].tlX = screenX;
      data[i].tlY = screenY;
      data[i].brX = screenX + width;
      data[i].brY = screenY + height;
      data[i].dndEnabled = true;
    });
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
    // console.log(`mouseX: ${x} - mouseY: ${y}`);
    // console.log(`tlX: ${data[0].tlX} - tlY: ${data[0].tlY}`);
    return it;
  };
  const updateItemState = (item, properties) => {
    console.log('Update item');
    const index = dataRef.current.findIndex(({ code }) => code === item.code);
    setData((d) => [
      ...d.slice(0, index),
      {
        ...d[index],
        ...properties,
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
  //console.log(data[0]);
  return (
    <View style={{ backgroundColor: 'orange' }} {...panResponder.panHandlers}>
      {data.map((item, i) => (
        <View
          key={i}
          ref={(element) => itemRefs.current.push(element)}
          onLayout={({ nativeEvent }) => onLayout({ nativeEvent, i })}
          style={[{ backgroundColor: item.bgColor ? item.bgColor : 'gray' }, styles.box]}
        >
          <Text>{item.name}</Text>
          <Text>{item.isBeingDragged ? 'TRUE' : 'FALSE'}</Text>
        </View>
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
            { backgroundColor: 'gray' },
          ]}
        >
          <Text>{itemBeingDragged.name}</Text>
        </Animated.View>
        )*/}
    </View>
  );
};
const data = [
  { code: '0001', name: 'Refresco', price: 120 },
  { code: '0002', name: 'Cerveza', price: 120 },
  { code: '0003', name: 'Malta', price: 120 },
  { code: '0004', name: 'Cola', price: 120 },
  { code: '0005', name: 'Limon', price: 120 },
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 80,
    height: 80,
    borderRadius: 4,
    //padding: 10,
    //margin: 10,
    /*position: 'absolute',*/
  },
  fixed: {
    backgroundColor: 'green',
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});
export default Draggable;
