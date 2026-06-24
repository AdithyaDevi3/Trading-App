import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import api from '../utils/api';
import Sparkline from '../components/Sparkline';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

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

  const { theme } = useContext(ThemeContext);

  if (!quote) return <View style={styles.container}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  return (
  <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]} contentContainerStyle={{padding:20}}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>${quote.price}</Text>
      <Text style={{color: quote.change >= 0 ? theme.colors.success : theme.colors.danger}}>Change: {quote.change} ({quote.changePercent}%)</Text>
      <Text style={{marginTop:8, color: theme.colors.muted}}>Last updated: {quote.timestamp}</Text>
      <Text style={{marginTop:16, marginBottom:8, color: theme.colors.muted}}>Last 30 days</Text>
      <Sparkline values={history} width={Math.min(Dimensions.get('window').width - 40, 600)} height={100} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  symbol: { fontSize: 32, fontWeight: '700' },
  price: { fontSize: 28, marginVertical: 8 }
});
