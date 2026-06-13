import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

// Minimal sparkline: receives array of numbers (prices)
export default function Sparkline({ values = [], color = '#2b8cff', width = 300, height = 60 }) {
  if (!values || values.length === 0) return <View style={{ width, height }} />;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline points={points} fill="none" stroke={color} strokeWidth={2} />
      </Svg>
    </View>
  );
}
