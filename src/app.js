const express = require('express');
const morgan = require ('morgan');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.set('port', process.env.port || 8080);


app.use(cors(/*{origin:"http://localhost:4200"} 10.128.0.32*/ ));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/auth',require('./routes/user.validations'));
module.exports = app;