const CoinDataManager = require('./services/coingecko');
const { getAllStrategyNames, getStrategy } = require('./strategies');

const defaultSymbols = ['bitcoin', 'ethereum', 'binancecoin'];
const INTERVAL = 5000;
const manager = new CoinDataManager();
let loop;
let analysisResults = [];

function analyzeAllStrategies(symbols) {
  const results = [];
  const allStrategyNames = getAllStrategyNames();

  for (const symbol of symbols) {
    const coinData = manager.getCoinData(symbol, 'daily');
    if (!coinData || !coinData.data || !coinData.data.prices) continue;
    const prices = coinData.data.prices.map(p => p[1]);
    if (!prices.length) continue;

    for (const strategyName of allStrategyNames) {
      const strategyFn = getStrategy(strategyName);
      const signal = strategyFn(prices);
      results.push({ symbol, strategy: strategyName, signal });
    }
  }
  return results;
}

async function fetchAndAnalyze(symbols) {
  const { updated } = await manager.fetchHistoricalData(symbols, 'daily');
  if (updated) {
    analysisResults = analyzeAllStrategies(symbols);
    console.log('Analysis updated:', analysisResults);
  }
}

function startAnalysisLoop(symbols = defaultSymbols) {
  fetchAndAnalyze(symbols);
  loop = setInterval(() => fetchAndAnalyze(symbols), INTERVAL);
}

function getAnalysisResults() {
  return analysisResults;
}

module.exports = {
  startAnalysisLoop,
  getAnalysisResults,
  analyzeAllStrategies,
};
