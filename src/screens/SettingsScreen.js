import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import storage from '../utils/storage';
import { ThemeContext } from '../ThemeContext';


export default function SettingsScreen() {
  const { theme, isDark, toggle } = useContext(ThemeContext);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('mock');

  useEffect(() => {
    (async () => {
      const s = await storage.get('settings');
      if (s) {
        setApiKey(s.apiKey || '');
        setProvider(s.provider || 'mock');
      }
    })();
  }, []);

  async function save() {
    await storage.set('settings', { apiKey, provider });
    alert('Saved');
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}] }>
      <Text style={{color: theme.colors.text, marginBottom:8}}>Market data provider (mock/live)</Text>
      <TextInput value={provider} onChangeText={setProvider} style={[styles.input, {backgroundColor: theme.colors.card, color: theme.colors.text}]} />
      <Text style={{color: theme.colors.text}}>API Key (for Alpha Vantage, etc.)</Text>
      <TextInput value={apiKey} onChangeText={setApiKey} style={[styles.input, {backgroundColor: theme.colors.card, color: theme.colors.text}]} autoCapitalize='none' />
      <Button title="Save" onPress={save} />

      <View style={{marginTop:20}}>
        <Text style={{color: theme.colors.text, marginBottom:8}}>Theme</Text>
        <TouchableOpacity onPress={toggle} style={{padding:10, backgroundColor: theme.colors.card, borderRadius:8}}>
          <Text style={{color: theme.colors.text}}>{isDark ? 'Dark' : 'Light'} mode — tap to toggle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex:1, padding:12 }, input: { borderWidth:1, borderColor:'#ccc', marginVertical:8, padding:8 } });
