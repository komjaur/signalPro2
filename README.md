# Crypto Signals

A stock Node.js service that fetches crypto data from CoinGecko and provides trading signals.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the service
   ```bash
   npm start
   ```
3. For development with auto reload
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  index.js           # server entry
  app.js             # express app setup
  analysis.js        # background analysis loop
  routes/
    analysis.js      # API endpoints
  services/
    coingecko.js     # fetches data from CoinGecko
  indicators/
    index.js
  strategies/
    createStrategy.js
    index.js
```

Environment variables can be defined in a `.env` file.
