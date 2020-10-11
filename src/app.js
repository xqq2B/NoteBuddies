const express = require('express');
const morgan = require ('morgan');
const cors = require('cors');

//test path
const path = require('path');


require('dotenv').config();

const app = express();

app.set('port', process.env.port || 3389);


app.use(cors(/*{origin:"http://localhost:4200"} 10.128.0.32*/ ));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//TEST port
app.get('/',(req,res)=>{
    console.log('hi');
    res.sendFile(path.join(__dirname,'views/index.html'));
});



app.use('/api/auth',require('./routes/user.validations'));
module.exports = app;