const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
require('dotenv').config();

app.set('port', process.env.port || 4000);

app.use(morgan('dev'));

app.use(require('./routes/user.validations'));

module.exports = app;