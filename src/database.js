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
console.log(pool);

 async function query(){await  pool.query('SELECT NOW()', (err, res) => {
    if(err)
    {
        console.log('DB Not Connected: '+err);
    }
    else
        console.log('DB Connected');
  });
}
  const getUsers= async ()  =>{
    try{
        console.log('Getting users');
    const result = await pool.query('Select * from usuario');
    console.log(result.rows);
    }catch(e){console.log(e);}
    
};
query();
getUsers();
module.exports ={pool};
