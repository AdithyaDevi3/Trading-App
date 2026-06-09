import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WatchlistScreen from './src/screens/WatchlistScreen';
import DetailScreen from './src/screens/DetailScreen';
import GlossaryScreen from './src/screens/GlossaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Watchlist" component={WatchlistScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Glossary" component={GlossaryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
