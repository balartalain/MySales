import React from 'react';
import theme from './Themes';

export const ThemeContext = React.createContext();

const ThemeProvider = ({children}) => {
    const a = ()=>{}
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
export default ThemeProvider;