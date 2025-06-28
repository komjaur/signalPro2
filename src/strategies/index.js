// strategies.js
const { createStrategy } = require("./createStrategy")

// We define a set of strategy configurations under simple string names.
// You can add or remove strategies as you wish.
const strategyConfigs = {
  "ema5-9": {
    type: "emaCross",
    shortPeriod: 5,
    longPeriod: 9
  },
  "ema10-20": {
    type: "emaCross",
    shortPeriod: 10,
    longPeriod: 20
  },
  "rsi14": {
    type: "rsi",
    period: 14,
    overbought: 70,
    oversold: 30
  },
  "macd12-26-9": {
    type: "macd",
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9
  }
  // Add more named strategies as needed
}

function getStrategy(strategyName) {
  const config = strategyConfigs[strategyName]
  if (config) {
    return createStrategy(config)
  }
  // Fallback to a default if not found
  return createStrategy(strategyConfigs["ema5-9"])
}

// Returns a list of all available strategy names
function getAllStrategyNames() {
  return Object.keys(strategyConfigs)
}

module.exports = { getStrategy, getAllStrategyNames }
