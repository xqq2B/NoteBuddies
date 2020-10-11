const userCtrl ={};
const {pool} = require('../database');
var User = require ('../models/User');
const helpers = require('../lib/passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const EMAIL_SECRET = process.env.EMAIL_SECRET;
const EMAIL_SECRET_PASS = process.env.EMAIL_SECRET_PASS;

//todos no es necesario
userCtrl.getUsers = async(req,res)=>{
    res.json('hay comunicacion!');
    /*const result = await pool.query('Select * from users');
    res.json(result.rows);*/
};

//login por username y password
userCtrl.loginUser = async (req,res)=>{
    User = req.body;
    console.log(User);
    try{
        const Verification = await helpers.signIn(User);
        if(Verification){
            res.json(Verification);
        }
        else
            res.json({status:'Failed'});
    }catch(e){
        console.log(e);
    }
};

//register user
userCtrl.registerUser =async (req,res)=>{      
    User = req.body;
    console.log(User);
    try {
        const Verification = await helpers.signUp(User);
        if (Verification) {
            res.json({ status: 'Registered' });
        }
        else
            res.json({ status: 'Email already registered!' });

    } catch (e) {
        console.log(e);
    }
};

//confirm email

userCtrl.registerConfirm = async (req, res) => {
    try {
        const id = jwt.verify(req.params.token, EMAIL_SECRET);
        let text = 'SELECT estadoUsuario($1)';//users set active=1 where id_user=$1';
        let values = [id.user];
        console.log('cambiado');
        const {rows} = await pool.query(text, values);
        if (rows[0].activo == false) {
            await pool.query(text, values);
            console.log(rows[0].activo);
        }
    } catch (e) {
        res.send('error');
    }

    return res.redirect('http://google.com');//mandar al login
};


//edit password recovery
userCtrl.getRecovery = async (req,res)=>{
    const mail=req.body.email;
    console.log(mail);
    try{
        const Verification = await helpers.mailRe(mail);
        res.json({status: Verification});
    }catch(e){console.log(e);}
};

userCtrl.defaultPassword =async (req,res)=>{    
    try {
        console.log(req.params.token);
        const id =jwt.verify(req.params.token,EMAIL_SECRET_PASS);
        console.log('ok');
        let text = 'UPDATE usuario set pass=$1 where id_usuario=$2';
        const encPass = await helpers.encryptPassword(id.pass);
         let values =[encPass,id.user[0]];
         await pool.query(text,values);
         console.log(id.pass);
         console.log(id.user[0]);
         
       } catch (e) {
         res.send('error');
       }
     
       return res.redirect('http://google.com');
     };


module.exports = userCtrl;