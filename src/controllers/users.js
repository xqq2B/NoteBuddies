const userCtrl ={};
const {pool} = require('../database');
const hola = require('../lib/passport');
const userFormat = require('../models/User');
const User = require ('../models/User');
const helpers = require('../lib/passport');


//todos
userCtrl.getUsers = async(req,res)=>{
    const result = await pool.query('Select * from users');
    res.json(result.rows);
};

//alta en db
userCtrl.postUser = async (req,res)=>{
    const us = req.body.username;
    const pass = req.body.password;
    try{
        const epass = await helpers.encryptPassword(pass);
        const text = 'INSERT INTO users(username, password) VALUES ($1, $2)';
    const values = [us,epass];
    const result = await pool.query(text,values);
       res.json({status:'User Registered!'});
    }catch(e){
        console.log(e);
    }
    
};


//login por username y password
userCtrl.newLogin =async (req,res)=>{
    console.log(req.params);
    try{
        const text = 'SELECT * FROM users WHERE username = $1';
        const values= [req.params.username];
        
        const result = await pool.query(text,values);
        res.json(result.rows);
        console.log(result.rows[0].password);
    }catch(e){console.log(e);}
};


userCtrl.getRecovery = async (req,res)=>{
    try{
        const text = 'SELECT * FROM users WHERE username = $1';
        const values= [req.params.mail];

        const result = await pool.query(text,values);
        if(result.rows.length>0){
            res.json({status:'Email Found!'});
            console.log(result.rows[0].username);
            //hola(result.rows[0].username);
        }
        else res.send('Email no registrado');
        
       
    
    }catch(e){console.log(e);}
};




module.exports = userCtrl;