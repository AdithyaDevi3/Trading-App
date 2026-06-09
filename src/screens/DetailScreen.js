import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from '../utils/api';

export default function DetailScreen({ route }) {
  const { symbol } = route.params;
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.getQuote(symbol);
      setQuote(res);
    })();
  }, [symbol]);

  if (!quote) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>${quote.price}</Text>
      <Text>Change: {quote.change} ({quote.changePercent}%)</Text>
      <Text>Last updated: {quote.timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  symbol: { fontSize: 32, fontWeight: '700' },
  price: { fontSize: 28, marginVertical: 8 }
});
