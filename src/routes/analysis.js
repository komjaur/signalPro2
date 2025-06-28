const express = require('express');
const { getAnalysisResults } = require('../analysis');

const router = express.Router();

router.get('/signal', (req, res) => {
  res.json(getAnalysisResults());
});

router.get('/analysis/symbols', (req, res) => {
  const results = getAnalysisResults();
  const symbols = [...new Set(results.map(r => r.symbol))];
  res.json(symbols);
});

router.get('/signal/symbols', (req, res) => {
  const symbolsParam = req.query.symbols;
  const results = getAnalysisResults();
  if (!symbolsParam) return res.json(results);
  const requested = symbolsParam.split(',').map(s => s.trim());
  const filtered = results.filter(r => requested.includes(r.symbol));
  res.json(filtered);
});

module.exports = router;
