// src/server.js
// If you load dotenv somewhere else (e.g. in server.js), delete this line.
require("dotenv").config();            

const express = require("express")
const CoinDataManager = require("./services/coingeckoService")
const { getAllStrategyNames, getStrategy } = require("./strategies")


const app = express()
const port = 3000

// Symbols for the background loop
const defaultSymbols = ["bitcoin", "ethereum", "binancecoin"]

// CoinGecko manager
const manager = new CoinDataManager()

// Interval for periodic fetch + analysis
const INTERVAL = 5000
let loop

// Holds latest analysis for all default symbols
let analysisResults = []

function analyzeAllStrategies(symbols) {
  const results = []
  const allStrategyNames = getAllStrategyNames()

  for (const symbol of symbols) {
    const coinData = manager.getCoinData(symbol, "daily")
    if (!coinData || !coinData.data || !coinData.data.prices) continue
    const prices = coinData.data.prices.map(p => p[1])
    if (!prices.length) continue

    for (const strategyName of allStrategyNames) {
      const strategyFn = getStrategy(strategyName)
      const signal = strategyFn(prices)
      results.push({ symbol, strategy: strategyName, signal })
    }
  }
  return results
}

function startLoop() {
  loop = setInterval(async () => {
    const { updated } = await manager.fetchHistoricalData(defaultSymbols, "daily")
    if (updated) {
      // Re-run analysis with fresh data
      analysisResults = analyzeAllStrategies(defaultSymbols)
      console.log("Analysis updated:", analysisResults)
    }
  }, INTERVAL)
}

// Start the loop
startLoop()

// Endpoint: get all analysis results
app.get("/signal", (req, res) => {
  res.json(analysisResults)
})

// Endpoint: get unique symbols from analysis
app.get("/analysis/symbols", (req, res) => {
  const symbols = analysisResults.map(item => item.symbol)
  const uniqueSymbols = [...new Set(symbols)]
  res.json(uniqueSymbols)
})

// Endpoint: filter analysis results by requested symbols
app.get("/signal/symbols", (req, res) => {
  const symbolsParam = req.query.symbols
  if (!symbolsParam) {
    // If none provided, just return all
    return res.json(analysisResults)
  }
  const requestedSymbols = symbolsParam.split(",").map(s => s.trim())
  const filteredResults = analysisResults.filter(result =>
    requestedSymbols.includes(result.symbol)
  )
  res.json(filteredResults)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
