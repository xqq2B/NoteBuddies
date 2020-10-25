const qryCtrl ={};
const {pool} = require('../database');
var User = require ('../models/User');
const helpers = require('../lib/passport');



//Consulta usuarios
qryCtrl.QueryUser = async(req,res)=>{
    const {rows} = await pool.query('SELECT * FROM vistaObtenerUsuario');
    console.log(rows);
    res.json( rows );
    //res.send(rows[0]);
};

//Alta usuarios
qryCtrl.CreateUser = async(req,res)=>{
    try{
        for (var i=0; i < req.body.length; i++) {
            let text = ('SELECT cambiarRolaUsuario($1,$2)');
            let values = [req.body[i].id_user, req.body[i].id_rol];
             await pool.query(text, values);
        }
        res.json({status:'Rol Applied!'});
    }
    catch(e){
        res.json({status:e});
    }
};

//Edit usuarios
qryCtrl.EditUser = async (req, res) => {
    console.log(req.params);
    let text = 'SELECT editarUsuario($1,$2,$3,$4)';
    let values = [req.body.id_user, req.body.username, req.body.lastname, req.body.telephone];
    await pool.query(text, values);
    res.json({ status: 'User Edited!' });
};

//Delete usuarios
qryCtrl.DelUser = async(req,res)=>{
    let id_user = req.params.id_user;//id_Rol_Delete;
    console.log(req.params);
    let text =('SELECT estadoUsuario($1)');
    let values= [id_user];
    await pool.query(text,values);
    res.json({status:'User Deleted!'});
    console.log('User Deleted!');
};



/////////////////////////////////////////
//ROLES

//Consulta roles
qryCtrl.QueryRol = async(req,res)=>{
    let activo= true;
    let text ='SELECT * FROM verRoles WHERE activo = $1 ORDER BY nombrerol ASC';
    let values = [activo];
    const result = await pool.query (text,values);
    //const result = await pool.query('SELECT * FROM verRoles WHERE activo = true ORDER BY nombrerol ASC');//verRolesyPermisos');
    res.json(result.rows);
};


//Alta roles
qryCtrl.CreateRol = async(req,res)=>{
    console.log(req.body);//name_ROl_Add
    Rol=req.body.name_Rol_Add;
    let activo = true;
    try {
        let text = 'SELECT nombreRol FROM verRoles WHERE nombreRol=$1 AND activo =$2'; //error nombrerol column not exist
        let values = [Rol,activo];
        const { rows } = await pool.query(text,values);
        console.log(rows);
        if (rows.length == 0) {
            await makeIdRol().then(res => id_rol = res.toString());
            console.log(id_rol);
            let text = 'SELECT createRol($1,$2)';
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
        let id_rol = req.body.id_Rol_Edit;
        let new_rol = req.body.name_Rol_Edit;
        console.log(req.body);
        let text = 'SELECT updateRol($1,$2)';
        let values = [id_rol,new_rol];
        await pool.query(text, values);
        res.json({ status: 'Rol Edited!' });
    } catch (e) {
        res.json({ status: e });
    }
};

// //Delete roles
qryCtrl.DelRol = async(req,res)=>{
    let id_rol = req.params.id_Rol;//id_Rol_Delete;
    console.log(req.params);
    let text =('SELECT estadoRol($1)');
    let values= [id_rol];
    await pool.query(text,values);
    res.json({status:'Rol Deleted!'});
    console.log('Rol Deleted!');
};



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