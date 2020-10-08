const {Pool}  = require('pg');
require('dotenv').config();
const host = process.env.hostdb;
const user = process.env.userdb;
const password = process.env.passworddb;
const database = process.env.databasedb;




const config ={
    user,
    host,
    password,
    database
};

    const pool = new Pool(config);

const getUsers= async ()  =>{
    try{
        console.log('Testing db connection');
        await pool.query('Select * from users');
        console.log('connected');
    }catch(e){console.log('DB ERROR '+e);}
    
    //pool.end(); no usar en app, solo aqui
};
getUsers();
module.exports ={pool};