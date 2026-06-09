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
};
