import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Pressable,
} from 'react-native';
import { TText } from './ThemedText';
import useTheme from '../useTheme';

// function withStyles(Component) {
//   return props => {
//     const style = {padding: '0.2rem', margin: '1rem'};
//     return <Component style={style} {...props} />;
//   };
// }

const ThemedButton = ({ children, ...props }) => {
  const theme = useTheme();
  const backgroundColor = props.bg ? theme[props.bg] : 'black';
  const btnStyles = {
    ...styles.button,
    ...props.style,
    backgroundColor,
  };
  const btnText = {
    ...styles.text,
    ...props.textStyle,
  };
  return (
    <TouchableOpacity style={btnStyles} onPress={props.onPress}>
      {!props.title ? children : <Text style={btnText}>{props.title}</Text>}
    </TouchableOpacity>
  );
};
export { ThemedButton, TText };
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    //elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
