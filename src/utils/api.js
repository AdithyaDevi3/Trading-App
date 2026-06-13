import storage from './storage';

const mockPrices = {
  AAPL: { price: 180.12, change: -1.2, changePercent: -0.66, timestamp: new Date().toISOString() },
  MSFT: { price: 340.45, change: 2.34, changePercent: 0.69, timestamp: new Date().toISOString() },
};

async function getSettings() {
  const s = await storage.get('settings');
  return s || { provider: 'mock', apiKey: '' };
}

async function fetchAlphaVantageQuote(symbol, apiKey) {
  // Use Global Quote endpoint
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const json = await res.json();
  const g = json['Global Quote'] || json['Global quote'] || null;
  if (!g) return { price: null, change: null, changePercent: null, timestamp: null };
  const price = parseFloat(g['05. price'] || g['05. Price'] || null);
  const change = parseFloat(g['09. change'] || g['09. Change'] || null);
  let changePercentRaw = g['10. change percent'] || g['10. Change Percent'] || g['10. change percent'] || null;
  let changePercent = null;
  if (changePercentRaw) {
    changePercent = parseFloat(String(changePercentRaw).replace('%', '').trim());
  }
  return { price, change, changePercent, timestamp: new Date().toISOString() };
}

export default {
  async getQuote(symbol) {
    const settings = await getSettings();
    if (settings.provider === 'mock') {
      return mockPrices[symbol] || { price: null, change: null, changePercent: null, timestamp: null };
    }
    if (settings.provider === 'alphavantage' || settings.provider === 'alpha') {
      if (!settings.apiKey) throw new Error('API key not set in Settings');
      try {
        return await fetchAlphaVantageQuote(symbol, settings.apiKey);
      } catch (e) {
        console.warn('AlphaVantage fetch failed, falling back to mock', e);
        return mockPrices[symbol] || { price: null, change: null, changePercent: null, timestamp: null };
      }
    }
    // Unknown provider: fallback to mock
    return mockPrices[symbol] || { price: null, change: null, changePercent: null, timestamp: null };
  },
  async getQuotes(symbols) {
    const out = {};
    await Promise.all(symbols.map(async s => { out[s] = await this.getQuote(s); }));
    return out;
  }
  ,
  // return array of recent closing prices (oldest->newest)
  async getHistory(symbol, days = 30) {
    const settings = await getSettings();
    if (settings.provider === 'mock') {
      // synthesize a small sine-ish walk around base
      const base = (mockPrices[symbol] && mockPrices[symbol].price) || 100;
      const out = [];
      for (let i = days - 1; i >= 0; i--) {
        const noise = Math.sin(i / 3) * (base * 0.01) + (Math.random() - 0.5) * (base * 0.005);
        out.push(Number((base + noise - i * 0.02).toFixed(2)));
      }
      return out;
    }
    if (settings.provider === 'alphavantage' || settings.provider === 'alpha') {
      if (!settings.apiKey) throw new Error('API key not set in Settings');
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(settings.apiKey)}&outputsize=compact`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        const json = await res.json();
        const series = json['Time Series (Daily)'] || json['Time Series (daily)'] || null;
        if (!series) return [];
        const dates = Object.keys(series).sort(); // oldest first
        const recent = dates.slice(-days);
        const out = recent.map(d => Number(parseFloat(series[d]['4. close']).toFixed(2)));
        return out;
      } catch (e) {
        console.warn('AlphaVantage history failed, returning empty', e);
        return [];
      }
    }
    return [];
  }
};
