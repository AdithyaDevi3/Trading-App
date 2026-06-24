import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WatchlistScreen from './src/screens/WatchlistScreen';
import DetailScreen from './src/screens/DetailScreen';
import GlossaryScreen from './src/screens/GlossaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, ThemeContext } from './src/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={({navigation}) => ({
                headerStyle: { backgroundColor: theme.colors.background },
                headerTitleStyle: { color: theme.colors.text },
                headerRight: () => (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Glossary')} style={{paddingHorizontal:12}}>
                      <Ionicons name="book-outline" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{paddingHorizontal:12}}>
                      <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                )
              })}>
                <Stack.Screen name="Watchlist" component={WatchlistScreen} options={{ title: 'Trading' }} />
                <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Details' }} />
                <Stack.Screen name="Glossary" component={GlossaryScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
