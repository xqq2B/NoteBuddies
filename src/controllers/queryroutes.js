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
        // console.log(zonesRoutes[175]);
        // console.log(zonesRoutes[175].groups[0]);
        for (let i = 0; i < zonesRoutes.length; i++) 
        {
            if(zonesRoutes[i].groups[0]!= null){
                if (zonesRoutes[i].groups[0].id == zones[0].id) {
                    Rutas.push({ id: zonesRoutes[i].id, name: zonesRoutes[i].name });
                }
                // else{
                //     console.log('no existe');
                // }
            }
            else{
                console.log('registro incompleto',i);
            }
            
        }
        res.json({ Rutas });
        console.log(Rutas.length);
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
        console.log(result.rows[0].bd);
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
            typeName: "Zone",
            search: {
            }
        });
        var Checkpoints = [];
        for (var i = 0; i < zonesCheckPoints.length; i++) {
            if (zonesCheckPoints[i].groups[0] != null) {
                if (zonesCheckPoints[i].groups[0].id == zones[0].id) {
                    Checkpoints.push({ id: zonesCheckPoints[i].id, name: zonesCheckPoints[i].name });
                }
            }
        }
        console.log(zonesCheckPoints[2]);
        res.json({ Checkpoints });
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};



//Drivers
qryCtrlRoutes.QueryDriver = async (req, res) => {
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
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        console.log('Drivers');
        const drivers = await api.call("Get", {
            typeName: "User",//para sacar id
            search: {
                isDriver: "true"
            }
        });
        console.log(drivers[0].name);
        const driver = [];
        console.log(drivers.length);
        for (var i = 0; i < drivers.length; i++) {
            if (drivers[i].name != null) {
                driver.push({ name: drivers[i].name });
            }
        }
        res.json({ driver });
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};

//Trailers
qryCtrlRoutes.QueryTrailer = async (req, res) => {
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
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        //console.log('Trailer');
        const trailers = await api.call("Get", {
            typeName: "Trailer",//para sacar id
            search: {
                //isDriver:"true"
            }
        });
        console.log(trailers);
        const trailer = [];
        console.log(trailers.length);
        for (var i = 0; i < trailers.length; i++) {
            if(trailers[i].name!= null){
            trailer.push({ name: trailers[i].name,id:trailers[i].id });
        }
        }
        res.json({ trailer });
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};


//Create Routes
qryCtrlRoutes.CreateRoute = async (req, res) => {
    try {
        console.log(req.body);
         var ruta=req.body;
         console.log(ruta);
        //verificar si ya existen campos y conductor se puede repetir cuando tenga horarios diferentes
        // let text = 'Buscar en RUTAS DONDE $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE id_usuario = $1';
        // let values = [req.body.id_user];
        // const result = await pool.query(text, values);
        // //si hay un campo repetido regresar ese campo
        // if(repetido==true){
        //     res.json({repetidos:row.campo1,row.campo2});
        // }
        // //crear ruta
        // let text = 'CREATE RUTA INSERT $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE id_usuario = $1';
        // let values = [req.body.id_user];
        // const result = await pool.query(text, values);
        res.json({status:'ok'});
    }
    catch (e) {
        console.log('ERROR CREANDO RUTAS' + e);
    }
};

//Edit Routes
qryCtrlRoutes.EditRoute = async (req, res) => {
    try {
        console.log(req.body);
         var ruta=req.body;
         console.log('editando ruta');
        //verificar si ya existen campos y conductor se puede repetir cuando tenga horarios diferentes
        // let text = 'Buscar en RUTAS DONDE $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE id_usuario = $1';
        // let values = [req.body.id_user];
        // const result = await pool.query(text, values);
        // //si hay un campo repetido regresar ese campo
        // if(repetido==true){
        //     res.json({repetidos:row.campo1,row.campo2});
        // }
        // //crear ruta
        // let text = 'CREATE RUTA INSERT $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE id_usuario = $1';
        // let values = [req.body.id_user];
        // const result = await pool.query(text, values);
        res.json({status:'ok'});
    }
    catch (e) {
        console.log('ERROR EDITANDO RUTAS' + e);
    }
};

module.exports = qryCtrlRoutes;