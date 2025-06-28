function ema(data, period) {
    if (data.length < period) return []
    const k = 2 / (period + 1)
    let result = []
    result[0] = data[0]
    for (let i = 1; i < data.length; i++) {
      result[i] = data[i] * k + result[i - 1] * (1 - k)
    }
    return result
  }
  
  function sma(data, period) {
    if (data.length < period) return []
    let result = []
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum += data[i]
      if (i >= period) {
        sum -= data[i - period]
      }
      if (i >= period - 1) {
        result.push(sum / period)
      }
    }
    return result
  }
  
  function wma(data, period) {
    if (data.length < period) return []
    let result = []
    for (let i = 0; i < data.length - period + 1; i++) {
      let weightSum = 0
      let sum = 0
      for (let j = 0; j < period; j++) {
        let weight = period - j
        weightSum += weight
        sum += data[i + j] * weight
      }
      result.push(sum / weightSum)
    }
    return result
  }
  
  function rsi(data, period = 14) {
    if (data.length < period + 1) return []
    let gains = 0
    let losses = 0
    for (let i = 1; i <= period; i++) {
      let diff = data[i] - data[i - 1]
      if (diff >= 0) gains += diff
      else losses -= diff
    }
    gains /= period
    losses /= period
    let result = []
    let rs = losses === 0 ? 100 : gains / losses
    result.push(100 - 100 / (1 + rs))
    for (let i = period + 1; i < data.length; i++) {
      let diff = data[i] - data[i - 1]
      if (diff > 0) {
        gains = (gains * (period - 1) + diff) / period
        losses = (losses * (period - 1)) / period
      } else {
        gains = (gains * (period - 1)) / period
        losses = (losses * (period - 1) - diff) / period
      }
      rs = losses === 0 ? 100 : gains / losses
      result.push(100 - 100 / (1 + rs))
    }
    return result
  }
  
  function macd(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    let fast = ema(data, fastPeriod)
    let slow = ema(data, slowPeriod)
    if (fast.length < slow.length) slow = slow.slice(slow.length - fast.length)
    if (slow.length < fast.length) fast = fast.slice(fast.length - slow.length)
    let macdLine = fast.map((v, i) => v - slow[i])
    let signalLine = ema(macdLine, signalPeriod)
    if (signalLine.length < macdLine.length) {
      macdLine = macdLine.slice(macdLine.length - signalLine.length)
    }
    let histogram = macdLine.map((v, i) => v - signalLine[i])
    return { macdLine, signalLine, histogram }
  }
  
  function bollingerBands(data, period = 20, multiplier = 2) {
    if (data.length < period) return []
    let smaArr = sma(data, period)
    let result = []
    for (let i = 0; i < smaArr.length; i++) {
      let startIndex = i
      let endIndex = i + period
      let segment = data.slice(startIndex, endIndex)
      let mean = smaArr[i]
      let variance = 0
      for (let x of segment) {
        variance += Math.pow(x - mean, 2)
      }
      variance /= period
      let stdDev = Math.sqrt(variance)
      result.push({
        middle: mean,
        upper: mean + multiplier * stdDev,
        lower: mean - multiplier * stdDev
      })
    }
    return result
  }
  
  function momentum(data, period = 10) {
    if (data.length < period) return []
    let result = []
    for (let i = period; i < data.length; i++) {
      result.push(data[i] - data[i - period])
    }
    return result
  }
  
  function cci(data, period = 20) {
    if (data.length < period) return []
    let result = []
    let smaArr = sma(data, period)
    for (let i = 0; i < smaArr.length; i++) {
      let segment = data.slice(i, i + period)
      let mean = smaArr[i]
      let mad = 0
      for (let x of segment) {
        mad += Math.abs(x - mean)
      }
      mad /= period
      let cciValue = mad === 0 ? 0 : (data[i + period - 1] - mean) / (0.015 * mad)
      result.push(cciValue)
    }
    return result
  }
  
  function roc(data, period = 12) {
    if (data.length < period) return []
    let result = []
    for (let i = period; i < data.length; i++) {
      let r = ((data[i] - data[i - period]) / data[i - period]) * 100
      result.push(r)
    }
    return result
  }
  
  function kst(data) {
    if (data.length < 30) return []
    let roc10 = roc(data, 10)
    let roc15 = roc(data, 15)
    let roc20 = roc(data, 20)
    let roc30 = roc(data, 30)
    let smaRoc10 = sma(roc10, 10)
    let smaRoc15 = sma(roc15, 10)
    let smaRoc20 = sma(roc20, 10)
    let smaRoc30 = sma(roc30, 15)
    let minLen = Math.min(smaRoc10.length, smaRoc15.length, smaRoc20.length, smaRoc30.length)
    let offset10 = smaRoc10.length - minLen
    let offset15 = smaRoc15.length - minLen
    let offset20 = smaRoc20.length - minLen
    let offset30 = smaRoc30.length - minLen
    let result = []
    for (let i = 0; i < minLen; i++) {
      let v = (smaRoc10[i + offset10] * 1.0) +
              (smaRoc15[i + offset15] * 2.0) +
              (smaRoc20[i + offset20] * 3.0) +
              (smaRoc30[i + offset30] * 4.0)
      result.push(v)
    }
    return result
  }
  
  module.exports = {
    ema,
    sma,
    wma,
    rsi,
    macd,
    bollingerBands,
    momentum,
    cci,
    roc,
    kst
  }
  