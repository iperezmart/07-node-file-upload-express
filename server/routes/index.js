const express = require('express');
const app = express();

app.use(require('./upload'));
app.use(require('./images'));

module.exports = app;
