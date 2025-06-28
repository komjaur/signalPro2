const {
    ema,
    rsi,
    macd,
    bollingerBands,
    momentum,
    cci,
    kst
  } = require("../indicators")
  
  function createStrategy(config) {
    const { type, ...params } = config
    return (prices) => {
      if (!Array.isArray(prices) || prices.length < 2) return null
      switch (type) {
        case "emaCross": {
          const { shortPeriod = 5, longPeriod = 9 } = params
          const shortEma = ema(prices, shortPeriod)
          const longEma = ema(prices, longPeriod)
          if (!shortEma.length || !longEma.length) return null
          const lastShort = shortEma[shortEma.length - 1]
          const lastLong = longEma[longEma.length - 1]
          return lastShort > lastLong ? "BUY" : "SELL"
        }
        case "rsi": {
          const { period = 14, oversold = 30, overbought = 70 } = params
          const rsiValues = rsi(prices, period)
          if (!rsiValues.length) return null
          const lastVal = rsiValues[rsiValues.length - 1]
          if (lastVal < oversold) return "BUY"
          if (lastVal > overbought) return "SELL"
          return null
        }
        case "macd": {
          const { fastPeriod = 12, slowPeriod = 26, signalPeriod = 9 } = params
          const { macdLine, signalLine } = macd(prices, fastPeriod, slowPeriod, signalPeriod)
          if (!macdLine.length || !signalLine.length) return null
          const lastMacd = macdLine[macdLine.length - 1]
          const lastSignal = signalLine[signalLine.length - 1]
          return lastMacd > lastSignal ? "BUY" : "SELL"
        }
        case "bollinger": {
          const { period = 20, multiplier = 2 } = params
          const bands = bollingerBands(prices, period, multiplier)
          if (!bands.length) return null
          const lastPrice = prices[prices.length - 1]
          const lastBands = bands[bands.length - 1]
          if (lastPrice > lastBands.upper) return "SELL"
          if (lastPrice < lastBands.lower) return "BUY"
          return null
        }
        case "momentum": {
          const { period = 10 } = params
          const momValues = momentum(prices, period)
          if (!momValues.length) return null
          const lastVal = momValues[momValues.length - 1]
          return lastVal > 0 ? "BUY" : "SELL"
        }
        case "cci": {
          const { period = 20, overbought = 100, oversold = -100 } = params
          const cciVals = cci(prices, period)
          if (!cciVals.length) return null
          const lastVal = cciVals[cciVals.length - 1]
          if (lastVal > overbought) return "SELL"
          if (lastVal < oversold) return "BUY"
          return null
        }
        case "kst": {
          const kstVals = kst(prices)
          if (!kstVals.length) return null
          const lastVal = kstVals[kstVals.length - 1]
          return lastVal > 0 ? "BUY" : "SELL"
        }
        default:
          return null
      }
    }
  }
  
  module.exports = { createStrategy }
  