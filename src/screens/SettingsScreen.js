import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import storage from '../utils/storage';

export default function SettingsScreen() {
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
    <View style={styles.container}>
      <Text>Market data provider (mock/live)</Text>
      <TextInput value={provider} onChangeText={setProvider} style={styles.input} />
      <Text>API Key (for Alpha Vantage, etc.)</Text>
      <TextInput value={apiKey} onChangeText={setApiKey} style={styles.input} autoCapitalize='none' />
      <Button title="Save" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex:1, padding:12 }, input: { borderWidth:1, borderColor:'#ccc', marginVertical:8, padding:8 } });
