const qryCtrlRoutes ={};
//const {pool} = require('../database');
//const helpers = require('../lib/passport');
const conexion = require ('../conexion');
const { pool } = require('../database');


//Consulta Rutas
qryCtrlRoutes.QueryRoute = async (req, res) => {
    try {
        var api;
        console.log(req.body.id_user);
        let text='select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values=[req.body.id_user];
        const result = await pool.query(text,values);
        console.log('bbbbbbbbbbbbbbbddddddddddddd'+result.rows[0].bd);
        console.log(result.rows);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
            console.log(api);
        }
        else {
            console.log('Otra base de datos');
            //registros tomados de github documentacion db
            api = await conexion.sessionOtherDb(result.rows[0].correo,result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        console.log(api);
        const results = await api.call("Get", {
            typeName: "Zone",//Route a Zone por geocercasearch por name, id, externalReference
            search: {
                //id:"b1D5"
                //name: "Ruta de pruebad"
                //externalReference:"metrica"
            },
            resultsLimit: 100
        });
        //console.log(results);
        //res.json(result[1].name);
        var Routes=[];
        for(var i=0;i<results.length;i++)
        {
            Routes[i]=results[i].name;
        }
       // console.log(Routes);
        //res.json(Routes);
        res.json({Routes});
        console.log(Routes[1]);
        //JSON.parse(await JSON.stringify(await updateSessionId()));
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};

 //Consulta Vehiculos
 qryCtrlRoutes.QueryDevice = async(req,res)=>{
    try {
        var api;
        let text='SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values=[req.body.id_user];
        const result = await pool.query(text,values);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
            console.log(api);
        }
        else {
            console.log('hi');
            //api = await conexion.sessionOtherDb(req.body.username,req.body.db, req.body.session, req.body.servo);
            api = await conexion.sessionOtherDb(result.rows[0].correo,result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        console.log(api);
        const results = await api.call("Get", {
            typeName: "Device",//search por name, id, externalReference
            search: {
                //id:"b1" DEVICE ID sale en ROUTES usar para buscar vehiculos
                //name: "Ruta de pruebad"
                //externalReference:"metrica"
                //deviceType:"GO6"
            },
            resultsLimit: 100
        });
        var Devices=[];
        for(var i=0;i<results.length;i++)
        {
             Devices[i]=await results[i].name;//sgregao await y quitado console.log
        }
        //console.log(results);
        //res.json(Routes);
        res.json({Devices});
        console.log(Devices[2]);
//        console.log(results[0].deviceType);
        //res.json(result[0].id);
    }
    catch (e) {
        console.log('ERROR RUTAS' + e);
    }
};

// //Alta Puntos de Rutas
// qryCtrlRoutes.CreateUser = async(req,res)=>{
//     try{
//         for (var i=0; i < req.body.length; i++) {
//             let text = ('SELECT cambiarRolaUsuario($1,$2)');
//             let values = [req.body[i].id_user, req.body[i].id_rol];
//              await pool.query(text, values);
//         }
//         res.json({status:'Rol Applied!'});
//     }
//     catch(e){
//         res.json({status:e});
//     }
// };


module.exports = qryCtrlRoutes;