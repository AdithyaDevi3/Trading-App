import React, { useState } from 'react';
import { View, Text, FlatList, Picker, StyleSheet, Button } from 'react-native';

const TERMS = [
  { key: 'ask', title: 'Ask', easy: 'Sell price', medium: 'Lowest price a seller will accept', hard: 'Price at which sell orders are posted' },
  { key: 'bid', title: 'Bid', easy: 'Buy price', medium: 'Highest price a buyer will pay', hard: 'Price at which buy orders are posted' },
  { key: 'spread', title: 'Spread', easy: 'Difference between bid/ask', medium: 'Difference between best bid and ask', hard: 'Transaction cost implied by market depth' }
];

export default function GlossaryScreen() {
  const [level, setLevel] = useState('easy');

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Text style={{marginRight:8}}>Familiarity:</Text>
        <Button title="Easy" onPress={() => setLevel('easy')} />
        <Button title="Medium" onPress={() => setLevel('medium')} />
        <Button title="Hard" onPress={() => setLevel('hard')} />
      </View>
      <FlatList data={TERMS} keyExtractor={t => t.key} renderItem={({item}) => (
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item[level]}</Text>
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  row: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontWeight: '600' }
});
