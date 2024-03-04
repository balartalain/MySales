import * as React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import useTheme from '../useTheme';

function withStyles(Component) {
    return props => {
      const style = { padding: '0.2rem', margin: '1rem' }
      return <Component style={style} {...props} />
    }
}
   
const ThemedTouchableOpacity = ({children, ...props})=> {
  const theme = useTheme();
  const backgroundColor =  props.bg?theme[props.bg]:undefined;
  const styles = {
    ...props,
    backgroundColor   
  }
  return (
    <TouchableOpacity style={styles}>
      {children}
    </TouchableOpacity>
  )
}
const ThemedButton = ({children, ...props})=> {
  console.log(props)
  const theme = useTheme();
  const backgroundColor =  props.bg?theme[props.bg]:undefined;

  return (
    <Button color={backgroundColor} title={props.title} style={props}>
      {children}
    </Button>
  )
}
export {ThemedTouchableOpacity, ThemedButton};
// const Button = (props) = {
//     return 
// }
// const Text = () => <p>Hello World!</p>

// const StyledButton = withStyles(Button)
// const StyledText = withStyles(Text)