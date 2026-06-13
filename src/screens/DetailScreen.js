import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import api from '../utils/api';
import Sparkline from '../components/Sparkline';

export default function DetailScreen({ route }) {
  const { symbol } = route.params;
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.getQuote(symbol);
      setQuote(res);
      // fetch history
      const hist = await api.getHistory(symbol);
      if (hist && hist.length) setHistory(hist);
    })();
  }, [symbol]);

  const [history, setHistory] = useState([]);

  if (!quote) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding:20}}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>${quote.price}</Text>
      <Text>Change: {quote.change} ({quote.changePercent}%)</Text>
      <Text>Last updated: {quote.timestamp}</Text>
      <Text style={{marginTop:16, marginBottom:8}}>Last 30 days</Text>
      <Sparkline values={history} width={330} height={80} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  symbol: { fontSize: 32, fontWeight: '700' },
  price: { fontSize: 28, marginVertical: 8 }
});
