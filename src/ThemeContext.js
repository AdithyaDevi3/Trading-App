import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { light, dark } from './theme';

export const ThemeContext = createContext({ theme: light, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await SecureStore.getItemAsync('theme.isDark');
        if (v) setIsDark(v === 'true');
      } catch (e) { /* ignore */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await SecureStore.setItemAsync('theme.isDark', isDark ? 'true' : 'false');
      } catch (e) { /* ignore */ }
    })();
  }, [isDark]);

  const toggle = () => setIsDark(s => !s);

  return (
    <ThemeContext.Provider value={{ theme: isDark ? dark : light, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
