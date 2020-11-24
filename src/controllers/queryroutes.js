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
        //console.log('bbbbbbbbbbbbbbbddddddddddddd' + result.rows[0].bd);
        console.log(result.rows);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
           // console.log(api);
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
       // console.log(zonesRoutes[0]);
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
        console.log('ERROR QUERY RUTAS' + e);
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
           // console.log(api);
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
        console.log('ERROR QUERY DEVICE RUTAS' + e);
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
            //console.log(api);
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
       // console.log(zones[0]);
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
       // console.log(zonesCheckPoints[2]);
        res.json({ Checkpoints });
    }
    catch (e) {
        console.log('ERROR QUERY CHECKPOINTS RUTAS' + e);
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
            //console.log(api);
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
       // console.log(drivers[0].name);
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
        console.log('ERROR QUERY DRIVER RUTAS' + e);
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
        //console.log(trailers);
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
        console.log('ERROR QUERY TRAILER RUTAS' + e);
    }
};


async function makeIdRoute() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 20; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const text = 'SELECT * FROM ruta WHERE id_ruta= $1';
    const value =[result];
    const{rows}= await pool.query(text,value);
    if(rows.length>0) {
        console.log('id ruta repetido');
        makeIdRoute();}
        else{
            return result;
        }
 }

 

//Create Routes
qryCtrlRoutes.CreateRoute = async (req, res) => {
    try {
        var ruta = req.body;
        console.log(ruta);
        console.log(ruta.fechaFin);
        const {rows} = await pool.query('SELECT * FROM ruta');
        console.log(rows[0]);
        //el mes es el problema disminuir en 1 plz solo para donde se mete diferente/////////////////////////////
        var fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
        console.log(ruta.fechaIni.anio);
        var fllegada = new Date(ruta.fechaFin.anio, ruta.fechaFin.mes, ruta.fechaFin.dia);
        console.log(fsalida);
                    console.log(fllegada);
        // var dDate = new Date(ruta.fechaIni.anio,ruta.fechaIni.mes,ruta.fechaIni.dia,ruta.horaIni.hora,ruta.horaIni.minutos);
        // var aDate = new Date(ruta.fechaFin.anio,ruta.fechaFin.mes,ruta.fechaFin.dia,ruta.horaFin.hora,ruta.horaFin.minutos);

        var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
        var hllegada = new Date(0, 0, 0, ruta.horaFin.hora + ruta.horaFin.minutos);
        console.log(rows.length);
        var response= false;
        if (rows.length == 0) {
            
            fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
            fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
            hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
            hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
            console.log('entre a sin registros');
            console.log(hllegada);
            console.log(fllegada);
            //createRoute();
            let idRuta = await makeIdRoute();
            let text = 'SELECT createRuta($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)';
            let values = [idRuta, ruta.id_route, ruta.name_route, ruta.conductor, ruta.id_vehicle,
                ruta.name_vehicle, ruta.id_trailer,ruta.name_trailer, ruta.shipment, fsalida, hsalida, fllegada, hllegada, ruta.db];
            await pool.query(text, values);

            for (let y = 0; y < ruta.checkpoints.length; y++) {
                let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3,$4)';
                let values2 = [idRuta, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto, ruta.id_user];
                await pool.query(text2, values2);
            }
            res.json({ status: 'ok' });
        }
        if (rows.length >0) {
            for (var i = 0; i < rows.length; i++) {
                console.log('hola');
                if (ruta.conductor == rows[i].conductor || ruta.name_vehiculo == rows[i].vehiculo || ruta.id_trailer == rows[i].id_trailer) {
                    console.log('conductor/vehiculo repetido');
                    var dDate = new Date(rows[i].fecha_salida);
                    var aDate = new Date(rows[i].fecha_llegada);
                    console.log(dDate);
                    console.log(rows[i].fecha_llegada);
                    //modificando mes menos 1
                    var mesS=parseInt(ruta.fechaIni.mes) ;
                    var mesL=parseInt(ruta.fechaFin.mes) ;
                    mesS=mesS-1;mesL=mesL-1;
                    console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesS);
                    console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesL);
                    ///////////////////
                    fsalida = new Date(ruta.fechaIni.anio, mesS, ruta.fechaIni.dia);
                    fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);
                    //fsalida.setMonth(+1);
                    //fllegada.setMonth(+1);
                    console.log(fsalida);
                    console.log(fllegada);
                    console.log('fechas');
                    console.log(dDate.getTime());
                    console.log(fsalida.getTime());
                    console.log(aDate.getTime());
                    console.log(fllegada.getTime());
                    if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
                        console.log('entre fechas');
                        var dates = rows[i].hora_salida.split(':');
                        var datel = rows[i].hora_llegada.split(':');
                        var dHour = new Date(0,0,0,dates[0],dates[1]);
                        var aHour = new Date(0,0,0,datel[0],datel[1]);
                        console.log(aHour);
                        console.log(dHour);
                    console.log(rows[i].hora_llegada);
                    console.log(hsalida);
                    console.log(dHour);
                    console.log(aHour);
                    console.log(i);
                        if ((hsalida >= dHour && hsalida <= aHour) ||
                            (hllegada >= dHour && hllegada <= aHour)) {
                                console.log('ultima parte');
                            response= true;
                            res.json({ status: 'Horarios Incompatibles' });
                        }
                    }
                }
            }
        }
        if(response == false){
            let idRuta = await makeIdRoute();
            console.log(idRuta);
            fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
            fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
            hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
            hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
            let text = 'SELECT createRuta($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)';
            let values = [idRuta, ruta.id_route, ruta.name_route, ruta.conductor, ruta.id_vehicle,
                ruta.name_vehicle, ruta.id_trailer, ruta.name_trailer, ruta.shipment, fsalida, hsalida, fllegada, hllegada, ruta.db];
            await pool.query(text, values);
            console.log('antes',ruta.checkpoints[0].id_punto);
            console.log(ruta.checkpoints.length);
            console.log(ruta.checkpoints[0].id_punto);
            for (let y = 0; y < ruta.checkpoints.length; y++) {
                let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
                let values2 = [idRuta, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto];
                await pool.query(text2, values2);
            }
            console.log('despues');
            res.json({ status: 'ok' });
        }
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
         let text=('SELECT * FROM ruta WHERE id_ruta=$1');
         let values=[ruta.id_routep];
         var response= false;
         
         var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
        var hllegada = new Date(0, 0, 0, ruta.horaFin.hora + ruta.horaFin.minutos);

         const {rows} = await pool.query(text,values);
         if(rows.length==0){
             res.json({status:'Not Found!'});
         }
         if (rows.length >0) {
                if (ruta.conductor == rows[0].conductor || ruta.name_vehiculo == rows[0].vehiculo || ruta.id_trailer == rows[0].id_trailer) {
                    console.log('conductor/vehiculo repetido');
                    var dDate = new Date(rows[0].fecha_salida);
                    var aDate = new Date(rows[0].fecha_llegada);
                    console.log(dDate);
                    console.log(rows[0].fecha_llegada);
                    var mesS=parseInt(ruta.fechaIni.mes) ;
                    var mesL=parseInt(ruta.fechaFin.mes) ;
                    mesS=mesS-1;mesL=mesL-1;
                    var fsalida = new Date(ruta.fechaIni.anio, mesS, ruta.fechaIni.dia);
                    var fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);
                    //fsalida.setMonth(+1);
                    //fllegada.setMonth(+1);
                    console.log(fsalida);
                    console.log(fllegada);
                    console.log('fechas');
                    console.log(dDate.getTime());
                    console.log(fsalida.getTime());
                    console.log(aDate.getTime());
                    console.log(fllegada.getTime());
                    if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
                        console.log('entre fechas');
                        var dates = rows[0].hora_salida.split(':');
                        var datel = rows[0].hora_llegada.split(':');
                        var dHour = new Date(0,0,0,dates[0],dates[1]);
                        var aHour = new Date(0,0,0,datel[0],datel[1]);
                        console.log(aHour);
                        console.log(dHour);
                    console.log(rows[0].hora_llegada);
                    console.log(hsalida);
                    console.log(dHour);
                    console.log(aHour);
//                    console.log(i);
                        if ((hsalida >= dHour && hsalida <= aHour) ||
                            (hllegada >= dHour && hllegada <= aHour)) {
                                console.log('ultima parte');
                            response= true;
                            res.json({ status: 'Horarios Incompatibles' });
                        }
                    }
                }
            }
            if(response == false){
                let fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
                let fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
                hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
                hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
                let text = 'SELECT updateRuta($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
                //se agrego status pedirlo para editar ruta y id de ruta propia
                let values = [ruta.id_routep, ruta.id_route, ruta.name_route, ruta.conductor, ruta.id_vehicle,
                    ruta.name_vehicle, ruta.id_trailer, ruta.name_trailer, ruta.shipment, fsalida, hsalida, fllegada, hllegada,ruta.status, ruta.db];
                await pool.query(text, values);
                console.log('ruta bn');
                for (let y = 0; y < ruta.checkpoints.length; y++) {
                    let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
                    //pedir hora y fecha ya que lo solicita la db
                    let values2 = [ruta.id_routep, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto,ruta.checkpoints[y].fecha,ruta.checkpoints[y].hora];
                    await pool.query(text2, values2);
                }
                res.json({ status: 'ok' });
            }
        }
    catch (e) {
        console.log('ERROR EDITANDO RUTAS' + e);
    }
};



//Show All by db
qryCtrlRoutes.QueryAll = async (req, res) => {
    try {
        //console.log(req.body);
        let text = ('SELECT * FROM ruta WHERE bd=$1');
        let values = [req.body.db];
        const routes = await pool.query(text, values);

        let cPoints = await pool.query('SELECT * FROM ruta_checkpoint');
        var rutaCompleta = [];
        /////
        for (var i = 0; i < cPoints.rows.length; i++) {
            for (var j = 0; j < routes.rows.length; j++) {
                if (cPoints.rows[i].id_ruta == routes.rows[j].id_ruta) {
                    rutaCompleta.push({ ruta: routes.rows[j], checkpoints: cPoints.rows[i] });
                }
                console.log('hello');
            }
        }
        //console.log(rutaCompleta)
        res.json({ rutaCompleta });


        // let text2 = ('SELECT * FROM ruta_checkpoint WHERE id_ruta=$1');
        // let values2 = [routes.rows[i].id_ruta];
        // const routes2 = await pool.query(text2, values2);


        // const cPoints = await pool.query('SELECT * FROM ruta_checkpoint');
        // var result = [];
        // var resultFinal = [];
        // console.log('1',routes.rows[0]);
        // for (var i = 0; i < routes.length; i++) {
        //     for (var j = 0; j < cPoints.length; j++) {
        //         if (routes.rows[i].id_ruta == cPoints.rows[j].id_ruta) {
        //             result.push(cPoints.rows[j]);
        //         }
        //     }
           
        //     resultFinal.push({ruta:routes.rows[i],checkpoints:result});
        //     result = [];
        // }
        // res.json({ Rutas: resultFinal });
    }
    catch (e) {
        console.log('ERROR CONSULTANDO RUTAS' + e);
    }
};

//Delete Route
qryCtrlRoutes.DeleteRoute = async (req, res) => {
    try {
        console.log(req.params);
         let text=('SELECT deleteRuta($1)');
         let values=[req.params.id_route];
         await pool.query(text,values);
         /*ERROR BORRANDO RUTASerror: update or delete on table "ruta" 
         violates foreign key constraint "fk_id_ruta_ruta_checkpoint" 
         on table "ruta_checkpoint"*/
        res.json({status:'ok'});
    }
    catch (e) {
        console.log('ERROR BORRANDO RUTAS' + e);
    }
};

module.exports = qryCtrlRoutes;