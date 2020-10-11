const {pool} = require('../database');

const bcrypt = require('bcrypt');
const {sendWelcomeEmail,sendEmailRec}  =require('./notifications');



const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (err) {
        console.log(err);
    }

};


/*helpers.signIn =async  (user)=>{

    const text = 'SELECT * FROM users WHERE email = $1';
        const values= [user.email];
        const {rows} = await pool.query(text,values);
    if (rows.length > 0) {
        const OkPass = await helpers.matchPassword(user.password, rows[0].password);
        if (rows[0].active != 1)
            return 'Email Not Confirmed!';
        else if (OkPass) {
            return rows[0];
        }
        else {
            return 'Wrong Password!';
        }
    }else return 'Unknown Email';
};*/

helpers.signIn =async  (user)=>{

    const text = 'SELECT * FROM usuario WHERE email = $1';
        const values= [user.email];
        const {rows} = await pool.query(text,values);
    if (rows.length > 0) {
        const OkPass = await helpers.matchPassword(user.password, rows[0].password);
        if (rows[0].active != 1)     
            return 'Email Not Confirmed!';
        else if (OkPass) {
            return rows[0];
        }
        else {
            return 'Wrong Password!';
        }
    }else return 'Something went wrong';
};

async function checkId (){
    const id_user = (Math.floor(Math.random() * (10000001)))+10000000;
    const text = 'SELECT * FROM usuario WHERE id_usuario= $1';//id_user
    const value =[id_user];
    const{rows}= await pool.query(text,value);
    if(rows.length>0) {
        console.log('id user repetido');
        checkId();}
    else{
        return id_user;
    } 
}/*

helpers.signUp =async  (newUser)=>{
    const text = 'SELECT * FROM users WHERE email = $1';
        const values= [newUser.email];
        const {rows} = await pool.query(text,values);
    if (rows.length == 0) {
        const encPass = await helpers.encryptPassword(newUser.password);
        await checkId().then(res => newUser.id_user = parseInt(res));
        newUser.id_rol = 2;
        console.log(newUser.id_user);
        let text = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)';
        let values = [newUser.username, encPass, newUser.lastname, newUser.email, newUser.telephone, newUser.id_rol, newUser.id_user];
        await pool.query(text, values);
        sendWelcomeEmail(newUser);
        return true;
    }
*/
helpers.signUp =async  (newUser)=>{
    const text = 'SELECT * FROM usuario WHERE correo = $1';//
        const values= [newUser.email];
        const {rows} = await pool.query(text,values);
    if (rows.length == 0) {
        const encPass = await helpers.encryptPassword(newUser.password);//lucidchart m
        await checkId().then(res => newUser.id_user = parseInt(res));
        //newUser.id_rol = 0; no mandar id rol
        let text = 'INSERT INTO usuario VALUES ($1, $2, $3, $4, $5, $6)';
        let values=[newUser.id_user,newUser.username,newUser.lastname,encPass,newUser.telephone,newUser.password];
        await pool.query(text, values);
        sendWelcomeEmail(newUser);
        return true;
    }

    else {
        return false;
    }

};

helpers.mailRe = async (mail)=>{    
    const text = 'SELECT * FROM users WHERE email = $1';
    const values= [mail];
    const {rows} = await pool.query(text,values);
    if(rows.length>0)
    {
       let size = Math.floor(Math.random() * (20 - 10 + 1) ) + 10;
       const nPass =makePass(size);
       let user = [rows[0].id_user];
       console.log(mail,nPass);
       return  sendEmailRec(user,mail,nPass);
    }
    else
        return 'Invalid Email';
};

function makePass(size) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < size; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 

module.exports = helpers;