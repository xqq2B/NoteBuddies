const qryCtrlRoutes = {};
//const {pool} = require('../database');
//const helpers = require('../lib/passport');
const conexion = require('../conexion');
const { pool } = require('../database');


//Consulta Rutas
qryCtrlRoutes.QueryRoute = async (req, res) => {
    try {
        var api;
        console.log(req.body.id_user);
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        console.log('bbbbbbbbbbbbbbbddddddddddddd' + result.rows[0].bd);
        console.log(result.rows);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
            console.log(api);
        }
        else {
            console.log('Otra base de datos');
            //registros tomados de github documentacion db
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        console.log(api);
        const zones = await api.call("Get", {
            typeName: "Group",//para sacar id
            search: {
                "name": "rutas"
                //checkpoints
            }
        });
        console.log(zones[0]);
        const zonesRoutes = await api.call("Get", {
            typeName: "Zone",
            search: {
            }
        });
        var Rutas = [];
        console.log(zones[0].id)
        console.log(zonesRoutes[0]);
        console.log(zonesRoutes.length);
        console.log(zonesRoutes[0].groups[0].id);
        console.log(zonesRoutes[0].id);
        console.log(zonesRoutes[0].name);
        for (let i = 0; i < zonesRoutes.length; i++) 
        {
            if (zonesRoutes[i].groups[0].id == zones[0].id) {
                // hola.push(zonesRoutes[i]);
                console.log(zonesRoutes[i]);
                Rutas.push({ id: zonesRoutes[i].id, name: zonesRoutes[i].name });
            }
            else{
                console.log('no existe');
            }
        }
        
        res.json({ Rutas });
        console.log(Rutas[3]);
        console.log(Rutas.length);
        console.log(zones[0].id);
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};

//Consulta Vehiculos
qryCtrlRoutes.QueryDevice = async (req, res) => {
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
            console.log(api);
        }
        else {
            console.log('hi');
            //api = await conexion.sessionOtherDb(req.body.username,req.body.db, req.body.session, req.body.servo);
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        const results = await api.call("Get", {
            typeName: "Device",//search por name, id, externalReference
            search: {
            },
            resultsLimit: 100
        });
        var Devices = [];
        for (var i = 0; i < results.length; i++) {
            Devices.push({ id: results[i].id, name: results[i].name });
        }
        res.json({ Devices });
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};

qryCtrlRoutes.QueryCheckpoints = async (req, res) => {
    try {
        var api;
        console.log(req.body.id_user);
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        console.log('bbbbbbbbbbbbbbbddddddddddddd' + result.rows[0].bd);
        console.log(result.rows);
        console.log('CheckPOINTS');
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
            console.log(api);
        }
        else {
            console.log('Otra base de datos');
            //registros tomados de github documentacion db
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        console.log('CheckPOINTS');
        const zones = await api.call("Get", {
            typeName: "Group",//para sacar id
            search: {
                "name":"checkpoints"
            }
        });
        console.log(zones[0]);
        const zonesCheckPoints= await api.call("Get",{
            typeName:"Zone",
            search:{
            }
        });
        var Checkpoints=[];
    for (var i = 0; i < zonesCheckPoints.length; i++)
    {
        if(zonesCheckPoints[i].groups[0].id==zones[0].id){
                Checkpoints.push({ id: zonesCheckPoints[i].id, name: zonesCheckPoints[i].name });
            }
        }
        console.log(zonesCheckPoints[2]);
        res.json({ Checkpoints });
        console.log(zones[0].id);
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};




module.exports = qryCtrlRoutes;