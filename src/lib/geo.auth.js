const GeotabApi = require('mg-api-js');
const geoCtrl ={};
const {pool} = require('../database');

async function userRegister(api) {
    const session = await api.authenticate();
    let text = 'SELECT createUsuario_Geotab($1,$2,$3)';
    let values = [session.credentials.sessionId, session.credentials.userName, session.credentials.database];//username es email
    await pool.query(text, values);
    res.json({email: session.credentials.userName});
    //res.redirect('http://google.com');//termine registro
    console.log('insertado usuario GEOTAB en DB');
}

async function revision() {
    // let text = 'SELECT * FROM Usuario WHERE correo = $1';
    // let values = [email];
    // const {rows} = await pool.query(text, values);
    // console.log(rows);
    const result = await pool.query('Select * from usuario');
    console.log(result.rows);
    //return rows;
}



geoCtrl.loginGeo = async (req, res) => {
    const authentication = {
        credentials: {
            database: req.body.database,
            userName: req.body.email,
            password: req.body.password
        }
    };

    try {
        const api = new GeotabApi(authentication);
        await api.authenticate(success => {
            
            revision();
            console.log(result);
            if (result.length == 0) {

                userRegister(api);
            }
            else if (result.rows.length != 0 && result.rows.telefono == null) {
                res.json({ email: req.bodyemail });
                //res.redirect('http://google.com');//terminar registro
            }
            else {

                res.json({ status: 'Ok!' });//,id_rol:rows.id_rol});
            }
        }, (error) => {
            res.json('Wrong Credentials!');
        });
    } catch (e) {
        console.log(e);
    }
};

geoCtrl.registerGeo =async (req,res)=>{      
    User = req.body;
    console.log(User);
    try {
        let text = 'UPDATE usuario SET telefono = $1, nombre = $2, apellido = $3  WHERE correo=$4';
        let values = [User.telephone, User.username, User.lastname, User.email];
        const {rows}=await pool.query(text, values);
        res.json({status:'Registered!',id_rol:rows.id_rol});
        //res.redirect('http://35.206.82.124/');//mandar a login
    } catch (e) {
        console.log(e);
    }
};


// async function checkId (){
//     const id_user = (Math.floor(Math.random() * (10000001)))+10000000;
//     const text = 'SELECT * FROM usuario WHERE id_usuario= $1';//id_user
//     const value =[id_user];
//     const{rows}= await pool.query(text,value);
//     if(rows.length>0) {
//         console.log('id user repetido');
//         checkId();}
//     else{
//         return id_user;
//     } 
// }




module.exports = geoCtrl;