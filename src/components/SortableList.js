import React, { PureComponent, startTransition, useEffect, useRef, useState } from 'react';
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
  Button,
} from 'react-native';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable);
import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;

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
  // Swap properties
  ['tlX', 'tlY', 'brX', 'brY'].forEach((prop) => {
    [array[from][prop], array[to][prop]] = [array[to][prop], array[from][prop]];
  });
  return [...array];
};

class SortableList extends PureComponent {
  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.measureItem = this.measureItem.bind(this);
    this.updateItemState = this.updateItemState.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
    this.onResponseEnd = this.onResponseEnd.bind(this);
    this.onShouldSetResponder = this.onShouldSetResponder.bind(this);
    this.findItemAtCoordinates = this.findItemAtCoordinates.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.toggleStartingScroll = this.toggleStartingScroll.bind(this);
    this.showChanges = this.showChanges.bind(this);
    this.swapItems = this.swapItems.bind(this);
    this._draggedPositionObject = {};
    this.itemsRefs = {};
    this.scrollViewRef = React.createRef(null);
    this.offsetY = 0;
    this.state = {
      startingScroll: this.props.startingScroll,
      items: [],
      draggedPositionObject: this._draggedPositionObject,
      //items: this.props.data.map((label, id) => ({ id, label })),
      itemBeingDragged: undefined,
      itemOverDragged: undefined,
      lastOverDragged: undefined,
    };

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return this.onShouldSetResponder(_, gestureState);
      },
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return this.onShouldSetResponder(evt, gestureState);
      },
      onPanResponderGrant: (e, gestureState) => {
        //console.log('Grant ' + this.state.itemBeingDragged.id);
        if (this.state.itemBeingDragged) {
          //this.state.draggedPositionObject[this.state.itemBeingDragged.id].setValue(0);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        //console.log('onMove ' + this.state.itemBeingDragged.id);
        // Actualiza la posición del componente según el movimiento del gesto
        const { moveX, moveY } = gestureState;
        const { itemBeingDragged, lastOverDragged } = this.state;

        if (itemBeingDragged) {
          const itemHeight = itemBeingDragged.brY - itemBeingDragged.tlY;
          if (moveY + itemHeight > windowHeight) {
            this.scrollViewRef.current.scrollTo({ y: this.offsetY + 30, animated: true });
          }
          if (moveY - itemHeight < this.state.items[0].tlY) {
            this.scrollViewRef.current.scrollTo({ y: this.offsetY - 30, animated: true });
          }
          this.state.draggedPositionObject[itemBeingDragged.id].setOffset(this.offsetY);
          this.state.draggedPositionObject[itemBeingDragged.id].setValue(
            moveY - itemBeingDragged.tlY - (itemBeingDragged.brY - itemBeingDragged.tlY) / 2,
          );
        }
        let neededUpdate = false;
        const currItemOver = this.findItemAtCoordinates(moveX, moveY, itemBeingDragged);
        if (currItemOver && lastOverDragged?.id !== currItemOver.id) {
          neededUpdate = true;
        }
        if (!currItemOver && lastOverDragged) {
          neededUpdate = true;
        }
        if (neededUpdate) {
          if (currItemOver) {
            this.updateItemState(currItemOver, {
              cls: 'currItemOver',
            });
          }
          if (lastOverDragged) {
            this.updateItemState(lastOverDragged, { cls: 'lastItemOver' });
          }
          this.setState({ lastOverDragged: currItemOver, itemOverDragged: currItemOver });
        }
      },
      onPanResponderEnd: () => {
        this.onResponseEnd();
      },
      onPanResponderRelease: () => {
        //this.onResponseEnd();
      },
    });
  } // end constructor
  onShouldSetResponder(evy, gestureState) {
    const { dx, dy, moveX, moveY, numberActiveTouches } = gestureState;
    // Do not set pan responder if a multi touch gesture is occurring
    if (numberActiveTouches !== 1 || !this.state.allowDragging) {
      return false;
    }

    // or if there was no movement since the gesture started
    if (dx === 0 && dy === 0) {
      return false;
    }
    // Find the tag below user's finger at given coordinates
    const item = this.findItemAtCoordinates(moveX, moveY);
    if (item) {
      // assign it to `this.tagBeingDragged` while dragging
      this.setState({ itemBeingDragged: item });
      //setItemDragging(item);
      // and tell PanResponder to start handling the gesture by calling `onPanResponderMove`
      return true;
    }

    return false;
  }
  onResponseEnd() {
    const { itemBeingDragged, itemOverDragged } = this.state;
    if (itemBeingDragged) {
      this.state.draggedPositionObject[itemBeingDragged.id].setValue(0);
      this.state.draggedPositionObject[itemBeingDragged.id].extractOffset();
      this.updateItemState(itemBeingDragged, { isBeingDragged: false, cls: 'lastItemOver' });
    }
    if (itemOverDragged) {
      this.updateItemState(itemOverDragged, { isBeingDragged: false, cls: 'lastItemOver' });
    }
    if (itemBeingDragged && itemOverDragged) {
      this.swapItems(itemBeingDragged, itemOverDragged);
    }
    this.setState({
      itemBeingDragged: undefined,
      lastOverDragged: undefined,
      itemOverDragged: undefined,
      allowDragging: false,
    });
  }
  showChanges(prevProps, prevState) {
    console.log('Propiedades que cambiaron:');
    Object.keys(this.props).forEach((key) => {
      if (this.props[key] !== prevProps[key]) {
        console.log(`  ${key}: ${prevProps[key]} → ${this.props[key]}`);
      }
    });

    console.log('Estados que cambiaron:');
    Object.keys(this.state).forEach((key) => {
      if (this.state[key] !== prevState[key]) {
        console.log(`  ${key}: ${prevState[key]} → ${this.state[key]}`);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.length === 0 && this.props.data.length > 0) {
      const data = this.props.data.map((label, id) => ({ id, label }));
      this.setState({ items: data });
      data.forEach((element) => {
        if (!this._draggedPositionObject[element.id]) {
          this._draggedPositionObject[element.id] = new Animated.Value(0);
        }
      });
    }
    // if (prevProps.data !== this.props.data) {
    //   const data = this.props.data;
    //   this.setState((state) => ({
    //     ...state,
    //     items: data.map((label, id) => ({ id, label })),
    //   }));
    //   console.log(this.state.items);
    //   this.state.items.forEach((element) => {
    //     this.setState((state) => {
    //       state.draggedPositionObject[element.id] = new Animated.Value(0);
    //     });
    //   });
    // }
    if (prevProps.startingScroll !== this.props.startingScroll) {
      this.setState({ startingScroll: this.props.startingScroll });
    }
    if (this.props.startingScroll !== 'child') {
      this.scrollViewRef.current.scrollTo({ y: this.props.scrollTo, animated: true });
    }
  }
  measureItem(id) {
    return new Promise((resolve, reject) => {
      const item = this.state.items.find((el) => el.id === id);
      this.itemsRefs[id].measure((x, y, width, height, screenX, screenY) => {
        const attrs = {
          tlX: screenX,
          tlY: screenY,
          brX: screenX + width,
          brY: screenY + height,
        };
        resolve({ item, ...attrs });
      });
    });
  }
  async onLayout({ nativeEvent, i }) {
    console.log('onlayout');
    setTimeout(async () => {
      const { item, tlX, tlY, brX, brY } = await this.measureItem(i);
      this.updateItemState(item, { tlX, tlY, brX, brY });
    }, 250);
  }
  onScroll(event) {
    this.offsetY = event.nativeEvent.contentOffset.y;
    //console.log(this.state.startingScroll);
    if (this.state.startingScroll === 'child') {
      //console.log('scrolling');
      this.props.onScrollTo(this.offsetY);
    }
  }
  updateItemState(item, props) {
    // console.log('Update item: ' + item.id);
    const { items } = this.state;
    const index = items.findIndex(({ id }) => id === item.id);
    this.setState((state) => {
      const newItems = [
        ...state.items.slice(0, index),
        {
          ...state.items[index],
          ...props,
        },
        ...state.items.slice(index + 1),
      ];
      return { ...state, items: newItems };
    });
  }
  swapItems(draggedItem, anotherItem) {
    const { items } = this.state;
    const draggedItemIndex = items.findIndex(({ id }) => id === draggedItem.id);
    const anotherItemIndex = items.findIndex(({ id }) => id === anotherItem.id);
    console.log(draggedItemIndex, anotherItemIndex);
    this.setState((state) => ({
      ...state,
      items: moveArrayElement(state.items, draggedItemIndex, anotherItemIndex),
    }));
    // this.setState({ items: moveArrayElement(items, draggedItemIndex, anotherItemIndex) });
    if (this.props.onSwapItems) {
      this.props.onSwapItems(draggedItemIndex, anotherItemIndex);
    }
  }
  findItemAtCoordinates(x, y, exceptItem) {
    const it = this.state.items.find(
      (item) =>
        isPointWithinArea(x, y + this.offsetY, item.tlX, item.tlY, item.brX, item.brY) &&
        (!exceptItem || exceptItem.id !== item.id),
    );
    // console.log(`mouseX: ${x} - mouseY: ${y}`);
    // console.log(
    //   `tlX: ${dataRef.current[0].tlX} - tlY: ${dataRef.current[0].tlY} - width: ${dataRef.current[0].brX} - height: ${dataRef.current[0].brY}`,
    // );
    return it;
  }
  onLongPress(e) {
    const { pageX, pageY } = e.nativeEvent;
    const item = this.findItemAtCoordinates(pageX, pageY);
    if (item) {
      this.state.draggedPositionObject[item.id].setOffset(0);
      this.updateItemState(item, {
        isBeingDragged: true,
        cls: 'itemDragged',
      });
      this.setState({ allowDragging: true });
    }
  }
  onPressOut(e) {
    const { pageX, pageY } = e.nativeEvent;
    setTimeout(() => {
      const { itemBeingDragged } = this.state;
      if (!itemBeingDragged) {
        const item = this.findItemAtCoordinates(pageX, pageY);
        if (item) {
          this.updateItemState(item, {
            isBeingDragged: false,
            cls: 'lastItemOver',
          });
        }
        this.setState({ itemBeingDragged: undefined, allowDragging: false });
      }
    }, 100);
  }
  toggleStartingScroll() {
    this.setState({ startingScroll: 'child' });
  }
  render() {
    const { items } = this.state;
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          ref={this.scrollViewRef}
          //style={{ backgroundColor: 'pink' }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          onScroll={this.onScroll}
          onScrollBeginDrag={this.toggleStartingScroll}
        >
          {items.map((item, i) => (
            <AnimatedTouchableOpacity
              key={i}
              ref={(el) => (this.itemsRefs[i] = el)}
              onLayout={({ nativeEvent }) => this.onLayout({ nativeEvent, i })}
              style={[
                this.props.itemStyle,
                {
                  transform: [{ translateY: this.state.draggedPositionObject[item.id] }],
                },

                // eslint-disable-next-line react-native/no-inline-styles
                { backgroundColor: i % 2 === 0 ? this.props.oddBgColor : 'white' },
                styles[item.cls],
              ]}
              onLongPress={this.onLongPress}
              onPressOut={this.onPressOut}
            >
              <Text style={this.props.textStyle}>{item.label}</Text>
            </AnimatedTouchableOpacity>
            /*<DraggableView key={i} backgroundColor={i % 2 === 0 ? '#61dafb' : 'green'} />*/
          ))}
        </ScrollView>
      </View>
    );
  }
}
SortableList.whyDidYouRender = true;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    padding: 10,
  },
  itemDragged: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: 'yellow',
    zIndex: 2,
    elevation: 25,
  },
  currItemOver: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: 'red',
    transform: [{ scale: 1.2 }, { translateY: 0 }],
    top: 0,
    zIndex: 1,
    elevation: 0,
  },
  lastItemOver: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    transform: [{ scale: 1 }, { translateY: 0 }],
    top: 0,
    zIndex: 1,
    elevation: 0,
  },
});
export default SortableList;
