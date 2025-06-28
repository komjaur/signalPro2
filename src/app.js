const express = require('express');
const analysisRouter = require('./routes/analysis');
const { startAnalysisLoop } = require('./analysis');

const app = express();
startAnalysisLoop();
app.use('/', analysisRouter);

module.exports = app;
