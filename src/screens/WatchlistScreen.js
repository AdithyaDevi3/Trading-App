import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet, RefreshControl } from 'react-native';
import api from '../utils/api';
import storage from '../utils/storage';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function WatchlistScreen({ navigation }) {
  const [symbols, setSymbols] = useState([]);
  const [input, setInput] = useState('');
  const [data, setData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useContext(ThemeContext);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (symbols.length) {
      const res = await api.getQuotes(symbols);
      setData(res);
    }
    setRefreshing(false);
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
    const change = q.change || 0;
    const changeColor = change >= 0 ? theme.colors.success : theme.colors.danger;
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { symbol: item })}>
        <View>
          <Text style={styles.symbol}>{item}</Text>
          <Text style={[styles.price, {color: changeColor}]}>{q.price ? `$${q.price}` : '—'}</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{color: changeColor, marginRight:8}}>{q.change ? `${q.change} (${q.changePercent}%)` : ''}</Text>
          <TouchableOpacity onPress={async () => {
            const filtered = symbols.filter(s => s !== item);
            setSymbols(filtered);
            await storage.set('watchlist', filtered);
          }}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
  <View style={[styles.container, {backgroundColor: theme.colors.background}] }>
      <View style={styles.controls}>
        <TextInput placeholder="Add symbol (e.g. AAPL)" value={input} onChangeText={setInput} style={styles.input} autoCapitalize="characters" />
        <TouchableOpacity style={styles.addButton} onPress={addSymbol}>
          <Text style={{color:'#fff'}}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={symbols}
        keyExtractor={s => s}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{margin:20}}>No symbols. Add one above.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{padding:12}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  input: { flex: 1, borderColor: '#e6eefc', borderWidth: 1, marginRight: 8, padding: 10, borderRadius:6, backgroundColor:'#fff' },
  addButton: { backgroundColor: theme.colors.primary, paddingHorizontal:16, paddingVertical:10, borderRadius:6 },
  card: { padding: 14, backgroundColor: theme.colors.card, borderRadius:10, marginBottom:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  symbol: { fontSize: 18, fontWeight: '700' },
  price: { color: '#666' }
});
