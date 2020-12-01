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
        //cambiado para usar tipo de zona
        // const zones = await api.call("Get", {
        //     typeName: "Group",//para sacar id
        //     search: {
        //         "name": "rutas"
        //         //checkpoints
        //     }
        // });
        const zones= await api.call("Get",{
            typeName:"ZoneType",
            search:{
                "name":'MM R Routes'        //para sacar entidad zonetype  filtrado por el nombre //MM R Checkpoints o MM R routes     
            },
            //resultsLimit: 500

        });
        const zonesRoutes = await api.call("Get", {
            typeName: "Zone",
            search: {
                zoneTypes: [{id:zones[0].id}]
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
               // if (zonesRoutes[i].groups[0].id == zones[0].id) { quitado no se requiere por cambio de filtro
                    Rutas.push({ id: zonesRoutes[i].id, name: zonesRoutes[i].name/*, points:zonesRoutes[i].points*/ });
                //}
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
        //se cambio para buscar por zone type
        // const zones = await api.call("Get", {
        //     typeName: "Group",//para sacar id
        //     search: {
        //         "name":"checkpoints"
        //     }
        // });
        const zones= await api.call("Get",{
            typeName:"ZoneType",
            search:{
                name:'MM R Checkpoint'        //para sacar entidad zonetype  filtrado por el nombre //MM R Checkpoints o MM R routes     
            },
            //resultsLimit: 500

        });
       // console.log(zones[0]);
        const zonesCheckPoints= await api.call("Get",{
            typeName: "Zone",
            search: {//como se cambio se agrega el id para filtrar
                zoneTypes: [{id:zones[0].id}]
            }
        });
        var Checkpoints = [];
        for (var i = 0; i < zonesCheckPoints.length; i++) {
            if (zonesCheckPoints[i].groups[0] != null) {
               // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
                    Checkpoints.push({ id: zonesCheckPoints[i].id, name: zonesCheckPoints[i].name/*, points: zonesCheckPoints[i].points*/ });
                }
            }
        
       // console.log(zonesCheckPoints[2]);
        res.json({ Checkpoints });
    }
    catch (e) {
        console.log('ERROR QUERY CHECKPOINTS RUTAS' + e);
    }
};


qryCtrlRoutes.QueryEndpoints = async (req, res) => {
    try {
        var api;
        console.log(req.body.id_user);
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        console.log(result.rows[0].bd);
        console.log(result.rows);
        console.log('ENDPOINTS');
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
            //console.log(api);
        }
        else {
            console.log('Otra base de datos');
            //registros tomados de github documentacion db
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        console.log('ENDPOINTS');
        //se cambio para buscar por zone type
        // const zones = await api.call("Get", {
        //     typeName: "Group",//para sacar id
        //     search: {
        //         "name":"checkpoints"
        //     }
        // });
        const zones= await api.call("Get",{
            typeName:"ZoneType",
            search:{
                name:'MM R Endpoint'        //para sacar entidad zonetype  filtrado por el nombre //MM R Checkpoints o MM R routes     
            },
            //resultsLimit: 500

        });
       // console.log(zones[0]);
        const zonesEndPoints= await api.call("Get",{
            typeName: "Zone",
            search: {//como se cambio se agrega el id para filtrar
                zoneTypes: [{id:zones[0].id}]
            }
        });
        var Endpoints = [];
        for (var i = 0; i < zonesEndPoints.length; i++) {
            if (zonesEndPoints[i].groups[0] != null) {
               // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
                    Endpoints.push({ id: zonesEndPoints[i].id, name: zonesEndPoints[i].name/*, points: zonesEndPoints[i].points*/ });
                }
            }
        
       // console.log(zonesCheckPoints[2]);
        res.json({ Endpoints });
    }
    catch (e) {
        console.log('ERROR QUERY ENDPOINTS RUTAS' + e);
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
        

       var driver=[];
       

       for(j=0;j<result.rows[0].json_build_object.grupo.length;j++){
        await api.call('Get', { typeName: 'User', search: { groups: [{ id: result.rows[0].json_build_object.grupo[j]}],isDriver:true } /*resultsLimit: 55*/ })
            .then(results => {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name != null) {
                    driver.push({ name: results[i].name });
                    }
                }
                console.log(results[0]);
            })
            .catch(error => {
                // some form of error occured with the request
                console.log('ERROR DRIVERS APICALL', error);
            });
        }
        //const driver = [];
        console.log(driver.length);
        //modificado por nueva polita
        // for (var i = 0; i < drivers.length; i++) {
        //     if (drivers[i].name != null) {
        //         driver.push({ name: drivers[i].name });
        //     }
        // }
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
        //se cancela por nueva politicca
        // const trailers = await api.call("Get", {
        //     typeName: "Trailer",//para sacar id
        //     search: {
        //         //isDriver:"true"
        //     }
        // });
        // //console.log(trailers);
        // const trailer = [];
        // console.log(trailers.length);
        // for (var i = 0; i < trailers.length; i++) {
        //     if(trailers[i].name!= null){
        //     trailer.push({ name: trailers[i].name,id:trailers[i].id });
        // }
        // }
        // res.json({ trailer });
        var trailer=[];
        var rep=false;
        for(j=0;j<result.rows[0].json_build_object.grupo.length;j++){
        await api.call('Get', { typeName: 'Trailer', search: { groups: [{ id: result.rows[0].json_build_object.grupo[j]}]}, /*resultsLimit: 15*/ })
                .then(results => {
                    for (var i = 0; i < results.length; i++) {
                        if(results[i].name!= null){
                            for(k=0;k<trailer.length;k++){
                                if(trailer[k].id==results[i].id){
                                    rep=true;
                                }
                            }
                            if (rep == false)
                                trailer.push({ name: results[i].name, id: results[i].id });
                        }
                    }
                })
                .catch(error => {
                    console.log('ERROR TRAILER APICALL', error);
                });
            }
        console.log(trailer.length);
        res.json({ trailer });
    }
    catch (e) {
        console.log('ERROR QUERY TRAILER RUTAS' + e);
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
        //cambiado por politica a grupos
        // const results = await api.call("Get", {
        //     typeName: "Device",//search por name, id, externalReference
        //     search: {
        //     },
          
        // });
        // var Devices = [];
        // for (var i = 0; i < results.length; i++) {
        //     Devices.push({ id: results[i].id, name: results[i].name });
        // }
        var device=[];
        var rep=false;
        for(j=0;j<result.rows[0].json_build_object.grupo.length;j++){
        await api.call('Get', { typeName: 'Device', search: { groups: [{ id: result.rows[0].json_build_object.grupo[j]}]}, /*resultsLimit: 15*/ })
                .then(results => {
                    for (var i = 0; i < results.length; i++) {
                        if(results[i].name!= null){
                            for(k=0;k<device.length;k++){
                                if(device[k].id==results[i].id){
                                    rep=true;
                                }
                            }
                            if (rep == false)
                                device.push({ name: results[i].name, id: results[i].id });
                        }
                    }
                })
                .catch(error => {
                    console.log('ERROR TRAILER APICALL', error);
                });
            }
        console.log(device.length);
        res.json({ device });
    }
    catch (e) {
        console.log('ERROR QUERY DEVICE RUTAS' + e);
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
        var hllegada = new Date(0, 0, 0, ruta.horaFin.hora, ruta.horaFin.minutos);
        console.log(rows.length);
        var response= null;
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
                response=false;
                if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (ruta.id_trailer == rows[i].id_trailer)) {
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
                    console.log(dDate.getTime());//salida bd
                    console.log(fsalida.getTime());//
                    console.log(aDate.getTime());//llegada db
                    console.log(fllegada.getTime());
                    if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
                        console.log('entre fechas');
                        var dates = rows[i].hora_salida.split(':');
                        var datel = rows[i].hora_llegada.split(':');
                        var dHour = new Date(0,0,0,dates[0],dates[1]);
                        var aHour = new Date(0,0,0,datel[0],datel[1]);
                        console.log(aHour);//1 y 4 si iguales
                        console.log(dHour);//2 y 3 iguales
                        console.log(hsalida);
                        console.log(hllegada);
                    //console.log(rows[i].hora_llegada);
                    console.log(hsalida.getTime());//1 y 3
                    console.log(hllegada.getTime());//2 y 3
                    console.log(dHour.getTime());
                    console.log(aHour.getTime());
                    console.log(i);
                        if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
                            ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
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



                //para crear ruta con end point

                let text3= 'SELECT createUsuario_Ruta(id_usuarioqueloestacreando,idRuta,grupo/sdeusuario)';//preguntar ultimo valor 
                let values3= [ruta.id_user,idRuta,ruta.group];
                await pool.query(text3,values3);

                    for(let i=0; i<ruta.group.length;i++)
                    {
                        let text4=('SELECT setGrupo($1,$2');
                        let values4 = [ruta.email,group[i]];
                        await pool.query(text4,values4);     
                    }
              //  }

                // 'SELECT createUsuario_Ruta(id_usuarioqueloestacreando,idRuta,grupo/sdeusuario)';
                // 'SELECT setGrupo($1,$2')
                // //checar que front si manda el id_user
                // grupos:{
                //     id:123123,
                //     id:123123.
                // }


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
         let text=('SELECT * FROM ruta WHERE id_ruta!=$1');
         let values=[ruta.id_routep];
         var response= false;//ojo aquiiiiiiiiiiiiii///////////////////////////// y en la parte de arriba
         
         var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
        var hllegada = new Date(0, 0, 0, ruta.horaFin.hora + ruta.horaFin.minutos);

         const {rows} = await pool.query(text,values);
//         console.log(rows);
        //  if(rows.length==0){
        //      res.json({status:'Not Found!'});
         //}//que no se compare con si misma
         if (rows.length >0) {
            for (var i = 0; i < rows.length; i++) {
                if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (ruta.id_trailer == rows[i].id_trailer)) {
                    console.log('conductor/vehiculo repetido');
                    var dDate = new Date(rows[i].fecha_salida);
                    var aDate = new Date(rows[i].fecha_llegada);
                    console.log(dDate);
                    console.log(rows[i].fecha_llegada);
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
                        var dates = rows[i].hora_salida.split(':');
                        var datel = rows[i].hora_llegada.split(':');
                        var dHour = new Date(0,0,0,dates[0],dates[1]);
                        var aHour = new Date(0,0,0,datel[0],datel[1]);
//                         console.log(aHour);
//                         console.log(dHour);
//                     console.log(rows[0].hora_llegada);
//                     console.log(hsalida);
//                     console.log(dHour);
//                     console.log(aHour);
// //                    console.log(i);
//                         if ((hsalida >= dHour && hsalida <= aHour) ||
//                             (hllegada >= dHour && hllegada <= aHour)) {
//                                 console.log('ultima parte');
//                             response= true;
//                             res.json({ status: 'Horarios Incompatibles' });
//                         }
                        console.log(hsalida.getTime());
                        console.log(hllegada.getTime());
                        console.log(dHour.getTime());
                        console.log(aHour.getTime());
                        
                            if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
                                ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
                                    console.log('ultima parte');
                                response= true;
                                res.json({ status: 'Horarios Incompatibles' });
                            }
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
                var nullHora=null;
                var nullFecha=null;
                let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta=$1";
                let values2=[ruta.id_routep];
                await pool.query(text2,values2);
                const {rows}=await pool.query('SELECT * FROM Ruta_Checkpoint');
                console.log(rows);
                console.log('borro');
                for (let y = 0; y < ruta.checkpoints.length; y++) {
                    //let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
                    let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
                    //pedir hora y fecha ya que lo solicita la db
                    let values2 = [ruta.id_routep, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto];//,nullFecha,nullHora];//,ruta.checkpoints[y].fecha,ruta.checkpoints[y].hora];
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
        //id de usuario para ver que rutas le corresponden
        //agregar end points
        //DESDE AQUI SERVIA HACIA ABAJO
        // let text = ('SELECT * FROM ruta WHERE bd=$1');
        // let values = [req.body.db];
        // const routes = await pool.query(text, values);

        // let cPoints = await pool.query('SELECT * FROM ruta_checkpoint');
        // var rutaCompleta = [];
        // var rutaCompletaCP = [];
        // console.log(cPoints.rows.length);   
        // console.log(routes.rows.length);
        // var x=-1;
//HASTA AQUI

        let text=('SELECT * FROM verRutasyCheckpoints WHERE id_ruta = (SELECT id_ruta FROM Usuario_Ruta WHERE id_grupo = (SELECT id_grupo FROM Usuario_Grupo WHERE id_usuario = $1))');
        let values=[req.body.id_user];
        const {rows}=await pool(text,values);
        //AGREGAR SACAR COORDENADAS DE CHECKPOINTS Y DE ENDPOINTS Y AGREGARLO A LO QUE SE DEVUELVE DE verrutasycheckpoints

        //solo entrara id_usuario

        /////
        // for (var j = 0; j < routes.rows.length; j++) {
        //     var a = -1;
        //     for (var i = 0; i < cPoints.rows.length; i++) {
        //         if (cPoints.rows[i].id_ruta == routes.rows[j].id_ruta) {
        //             a++;//veces que se repite
        //             if (cPoints.rows[i + 1].id_ruta == routes.rows[j + 1].id_ruta) {
        //                 b = j;//valor de j
        //                 rutaCompleta.push({ ruta: routes.rows[j] });
        //                 for (var k = 0; k < a; k++) {
        //                     rutaCompletaCP.push({ checkpoints: cPoints.rows[i] });
        //                 }
        //             }

        //             //    rutaCompleta.push({ ruta: routes.rows[j]});
        //             //    rutaCompletaCP.push({checkpoints: cPoints.rows[i]}); 
        //         }
        //         if (a!=-1)
        //         ultima.push({ ruta:routes.rows[a],checkpoints:cPoints.rows[i] });
        //     }
        // }
        // //console.log(rutaCompleta)
        // res.json({ ruta:rutaCompleta,checkpoints:rutaCompletaCP });
///asi servia hacia abajo
        // var result = [];
        // var resultFinal = [];
        // console.log('1',routes.rows[0]);
        // for (var i = 0; i < routes.rows.length; i++) {
        //     for (var j = 0; j < cPoints.rows.length; j++) {
        //         if (routes.rows[i].id_ruta == cPoints.rows[j].id_ruta) {
        //             result.push(cPoints.rows[j]);
        //         }
        //     }
           
        //     resultFinal.push({ruta:routes.rows[i],checkpoints:result});
        //     result = [];
        // }
         res.json({ rows });
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
        res.json({status:'ok'});
    }
    catch (e) {
        console.log('ERROR BORRANDO RUTAS' + e);
    }
};

module.exports = qryCtrlRoutes;