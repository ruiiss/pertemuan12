import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';

// ─── Theme Context ────────────────────────────────────────────────────────────
export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const LIGHT = {
  bg: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0FF',
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  danger: '#FF6B6B',
  dangerLight: '#FFE5E5',
  text: '#2D2D3A',
  textSecondary: '#8888AA',
  textMuted: '#BBBBCC',
  border: '#E0E0F0',
  card: '#FFFFFF',
  shadow: '#6C5CE720',
  isDark: false,
};

const DARK = {
  bg: '#14131F',
  surface: '#1E1D2E',
  surfaceAlt: '#28273C',
  primary: '#A29BFE',
  primaryLight: '#6C5CE7',
  danger: '#FF6B6B',
  dangerLight: '#3A1A1A',
  text: '#F0EFF8',
  textSecondary: '#9999BB',
  textMuted: '#555566',
  border: '#2E2D44',
  card: '#1E1D2E',
  shadow: '#00000040',
  isDark: true,
};

const DARK_MODE_KEY = '@notekeeper_dark_mode';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? DARK : LIGHT;

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(DARK_MODE_KEY);
        if (saved !== null) setIsDark(JSON.parse(saved));
      } catch (_) {}
    })();
  }, []);

  const toggleDark = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(next));
    } catch (_) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleDark }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <HomeScreen />
    </ThemeContext.Provider>
  );
}
