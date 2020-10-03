const express = require('express');
const morgan = require ('morgan');
const cors = require('cors');//aceptar peticiones de angular otro puerto

require('dotenv').config();

const app = express();

//enviroment variables
app.set('port', process.env.port || 4000);

//middlewares
app.use(cors(/*{origin:"http://localhost:4200"} */));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api',require('./routes/user.validations'));
module.exports = app;