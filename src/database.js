const {Pool}  = require('pg');
require('dotenv').config();
const host = process.env.host;
const user = process.env.user;
const password = process.env.password;
const database = process.env.database;




const config ={
    user,
    host,
    password,
    database
};

const pool = new Pool(config);
module.exports ={pool}
/*
const getUsers= async ()  =>{
    try{
        console.log('Getting users');
    const result = await pool.query('Select * from users');
    console.log(result.rows);
    }catch(e){console.log(e);}
    
    //pool.end(); no usar en app, solo aqui
};

const insertUser = async () =>{
    try{
        const text = 'INSERT INTO users(username, password) VALUES ($1, $2)';
    const values = ['jhon','jhon1234'];

    const res = await pool.query(text,values);
    console.log(res);
    pool.end();
    }catch(e){
        console.log(e);
    }
    
};

const deleteUser = async() =>{
    try{
        const text = 'DELETE FROM users WHERE username = $1';
        const values= ['moe'];

        const res = await pool.query(text,values);
        console.log(res)
    }catch(e){console.log(e);}
};

const editUser = async () =>{
    try{
        const text = 'UPDATE users SET username = $1, password= $2 WHERE username = $3';
        const values = ['Loe','12345','rudy'];
        const result = await pool.query(text,values);
        console.log(result);
    }catch(e){console.log(e);}
};


getUsers();

*/