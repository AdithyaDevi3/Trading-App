import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import api from '../utils/api';
import storage from '../utils/storage';

export default function WatchlistScreen({ navigation }) {
  const [symbols, setSymbols] = useState([]);
  const [input, setInput] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      const saved = await storage.get('watchlist');
      if (saved) setSymbols(saved);
    })();
  }, []);

  useEffect(() => {
    if (symbols.length === 0) return;
    (async () => {
      const res = await api.getQuotes(symbols);
      setData(res);
    })();
  }, [symbols]);

  async function addSymbol() {
    const sym = input.trim().toUpperCase();
    if (!sym) return;
    const next = Array.from(new Set([sym, ...symbols]));
    setSymbols(next);
    await storage.set('watchlist', next);
    setInput('');
  }

  function renderItem({ item }) {
    const q = data[item] || {};
    return (
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Detail', { symbol: item })}>
        <View>
          <Text style={styles.symbol}>{item}</Text>
          <Text style={styles.price}>{q.price ? `$${q.price}` : '—'}</Text>
        </View>
        <Button title="Remove" onPress={async () => {
          const filtered = symbols.filter(s => s !== item);
          setSymbols(filtered);
          await storage.set('watchlist', filtered);
        }} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TextInput placeholder="Add symbol (e.g. AAPL)" value={input} onChangeText={setInput} style={styles.input} />
        <Button title="Add" onPress={addSymbol} />
      </View>
      <FlatList data={symbols} keyExtractor={s => s} renderItem={renderItem} ListEmptyComponent={<Text style={{margin:20}}>No symbols. Add one above.</Text>} />
      <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
        <Button title="Glossary" onPress={() => navigation.navigate('Glossary')} />
        <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { flexDirection: 'row', padding: 10 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, marginRight: 8, padding: 8 },
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  symbol: { fontSize: 18, fontWeight: '600' },
  price: { color: '#666' }
});
