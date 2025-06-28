// src/services/coingeckoService.js
const fetch = require("node-fetch");


const HISTORICAL_REFRESH_INTERVAL = 60_000;          // 60 s
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

class CoinHistoricalData {
  constructor(coin, interval, lastUpdate, data, error = null) {
    this.coin = coin;
    this.interval = interval;
    this.lastUpdate = lastUpdate;
    this.data = data;
    this.error = error;
  }
}

function buildCoingeckoUrl(symbol, interval) {
  switch (interval) {
    case "5min":
      return `https://api.coingecko.com/api/v3/coins/${symbol}/ohlc?vs_currency=usd&days=1`;
    case "hourly":
      return `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=7&interval=hourly`;
    case "daily":
      return `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=365&interval=daily`;
    default:
      return `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=365`;
  }
}

class CoinDataManager {
  constructor() {
    this.coinDataMap = {};
  }

  async fetchHistoricalData(symbols, interval = "daily") {
    const results = [];
    let updated = false;

    for (const symbol of symbols) {
      if (!this.coinDataMap[symbol]) this.coinDataMap[symbol] = {};

      const existing = this.coinDataMap[symbol][interval];
      const fresh =
        existing && Date.now() - existing.lastUpdate < HISTORICAL_REFRESH_INTERVAL;

      if (fresh) {
        results.push(existing);
        continue;
      }

      updated = true;

      try {
        const url = buildCoingeckoUrl(symbol, interval);
        const res = await fetch(url, {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,   // ← fixed
          },
        });

        const data = await res.json();
        const record = new CoinHistoricalData(symbol, interval, Date.now(), data);

        this.coinDataMap[symbol][interval] = record;
        results.push(record);
      } catch (err) {
        const fallback = new CoinHistoricalData(
          symbol,
          interval,
          Date.now(),
          null,
          err.message,
        );

        this.coinDataMap[symbol][interval] = existing || fallback;
        results.push(this.coinDataMap[symbol][interval]);
      }
    }

    return { results, updated };
  }

  getCoinData(symbol, interval = "daily") {
    return this.coinDataMap?.[symbol]?.[interval] ?? null;
  }
}

module.exports = CoinDataManager;
