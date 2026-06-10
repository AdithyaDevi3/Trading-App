# Trading App (Expo)

This is a scaffolded React Native (Expo) trading app. It includes:

- Watchlist screen with mock market data provider
- Detail screen for a selected stock
- Glossary with adjustable familiarity level
- Settings screen for API keys

Getting started

1. Install dependencies (zsh / macOS):

```bash
cd /Users/home/Documents/Workspace/Projects/Trading-App
npm install
```

2. Start Expo dev server:

```bash
npm start
```

3. Open the Expo Go app on your device or run a simulator and load the project.

Notes

- This scaffold uses a mock data provider by default. You can add real API integration (Alpha Vantage) in `src/utils/api.js` and set your API key in Settings.
- Storage uses `expo-secure-store` so the app works with Expo Go without native prebuilds.
