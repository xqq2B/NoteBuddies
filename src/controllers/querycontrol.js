const qryCtrl ={};
const {pool} = require('../database');
var User = require ('../models/User');
const helpers = require('../lib/passport');



// //Consulta usuarios
// qryCtrl.QueryUser = async(req,res)=>{
//     console.log('hi');
//     const {rows} = await pool.query('Select * from users');
//     console.log(rows[0]);
//     //res.json(rows[0]);
//     //res.send(rows[0]);
// };

// //Alta usuarios
// qryCtrl.QueryCreate = async(req,res)=>{
//     console.log('hi');
//     const {rows} = await pool.query('Select * from users');
//     console.log(rows[0]);
// };

// //Edit usuarios
// qryCtrl.QueryEdit = async(req,res)=>{
//     User = req.params;
//     let text = 'UPDATE users SET username=$1, lastname=$2, email=$3, telephone=$4 WHERE email=$5';
//     let values =[User.username,User.lastname,User.email,User.telephone,User.id_user];
//     const {rows} = await pool.query(text,values);
//     res.json(rows[0]);
// };

// //Delete usuarios
// qryCtrl.DelUser = async(req,res)=>{
//     let id_user = req.params.id_user;
//     let text =('DELETE FROM users WHERE id_user = $1');
//     let values= [id_user];
//     await pool.query(text,values);
//     console.log(id_user+'Deleted!');
// };


//ROLES

//Consulta roles
qryCtrl.QueryRol = async(req,res)=>{
    const result = await pool.query('SELECT * FROM verRoles');//verRolesyPermisos');
    res.json(result.rows);
};


//Alta roles
qryCtrl.CreateRol = async(req,res)=>{
    console.log(req.body);
    Rol=req.body.rolname;
    try {
        let text = 'SELECT nombreRol FROM verRoles WHERE nombreRol=$1'; //error nombrerol column not exist
        let values = [Rol];
        const { rows } = await pool.query(text,values);
        console.log(rows);
        if (rows.length == 0) {
            //id_rol= '9898kajshd4';//makeIdRol();
            await makeIdRol().then(res => id_rol = res.toString());
            console.log(id_rol);
            let text = 'SELECT createRol($1,$2)';//idrol y nombre rol
            let values = [id_rol,Rol];
            await pool.query(text, values);
            res.json({ status: 'Rol Inserted!' });
        }
        else
            res.json({ status: 'Rol Repeated!' });
    }catch(e){//
        res.json(e);
        console.log(e);
    }
    
};

//Edit roles
qryCtrl.EditRol = async (req, res) => {
    try {
        let id_rol = req.params.id_Rol;
        let new_rol = req.params.new_Rol;
        console.log(req.params);
        let text = 'SELECT updateRole($1,$2)';
        let values = [id_rol,new_rol];
        await pool.query(text, values);
        res.json({ status: 'Rol Edited' });
    } catch (e) {
        res.json({ status: e });
    }
};

// //Delete roles
// qryCtrl.DelUser = async(req,res)=>{
//     let id_user = req.params.id_user;
//     let text =('DELETE FROM users WHERE id_user = $1');
//     let values= [id_user];
//     await pool.query(text,values);
//     console.log(id_user+'Deleted!');
// };



//helpers
async function makeIdRol() {
    let size = Math.floor(Math.random() * (20 - 10 + 1) ) + 10;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < size; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    //verification
    console.log(result);
    let text = 'SELECT nombreRol FROM verRoles WHERE id_rol=$1';
    let values = [result];
    const { rows } = await pool.query(text, values);
    if (rows.length > 0) {
        console.log('id rol repeated');
        makeIdRol();
    }
    else
    return result;
}
 

module.exports = qryCtrl;