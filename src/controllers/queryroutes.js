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


qryCtrlRoutes.QueryStartpoints = async (req, res) => {
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
        console.log('STARTPOINTS');
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
                name:'MM R Startpoint'        //para sacar entidad zonetype  filtrado por el nombre //MM R Checkpoints o MM R routes     
            },
            //resultsLimit: 500

        });
       // console.log(zones[0]);
        const zonesStartPoints= await api.call("Get",{
            typeName: "Zone",
            search: {//como se cambio se agrega el id para filtrar
                zoneTypes: [{id:zones[0].id}]
            }
        });
        var Startpoints = [];
        for (var i = 0; i < zonesStartPoints.length; i++) {
            if (zonesStartPoints[i].groups[0] != null) {
               // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
                    Startpoints.push({ id: zonesStartPoints[i].id, name: zonesStartPoints[i].name/*, points: zonesEndPoints[i].points*/ });
                }
            }
        
       // console.log(zonesCheckPoints[2]);
        res.json({ Startpoints });
    }
    catch (e) {
        console.log('ERROR QUERY STARTPOINTS RUTAS' + e);
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
    const text = 'SELECT * FROM Ruta_catalogo WHERE id_ruta_catalogo= $1';
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
qryCtrlRoutes.CreateSpecificRoute = async (req, res) => {
    try {
        var ruta = req.body;
        console.log(ruta);
        //const {rows} = await pool.query('SELECT * FROM ruta');
        const {rows} = await pool.query('SELECT * FROM ruta_configurada');

        let text=('SELECT * FROM ruta_catalogo WHERE id_ruta_catalogo=$1');
        let values=[ruta.id_ruta];
        const result = await pool.query(text,values);
        console.log(result.rows.length);
        console.log(rows.length);
        console.log(rows[0]);
        //el mes es el problema disminuir en 1 plz solo para donde se mete diferente/////////////////////////////
        var fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
        console.log(ruta.fechaIni.anio);
        console.log(fsalida);
        // var dDate = new Date(ruta.fechaIni.anio,ruta.fechaIni.mes,ruta.fechaIni.dia,ruta.horaIni.hora,ruta.horaIni.minutos);
        // var aDate = new Date(ruta.fechaFin.anio,ruta.fechaFin.mes,ruta.fechaFin.dia,ruta.horaFin.hora,ruta.horaFin.minutos);
        

        var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
       // var hllegada = new Date(0, 0, 0, ruta.horaFin.hora, ruta.horaFin.minutos);
        console.log(rows.length);
        var response= null;
        if (rows.length == 0) {
            //posiblemente no se usen//////////////
            //fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
            //fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
           // hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
            //hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
            ////hasta aqui no se usaria////////////////
            console.log('entre a sin registros');
            ///separador de fechas//////////////////
            fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            var fechaS = fsalida.toISOString();
            var separar = fechaS.split('T');
            var fechaa = separar[0].split('-');
            var horass = separar[1].split(':');
            var fsalidaa = fechaa[0]+"-"+fechaa[1]+"-"+fechaa[2];
            var hsalidaa = horass[0]+":"+horass[1]+":"+"00";
            ////////////////////
            console.log('aqui 2');
            ////suma de tiempo estimado////////////
            console.log(result.rows[0].tiempoestimado);/////checar
            console.log(result.rows[0]['tiempoestimado']);
            let m= result.rows[0].tiempoEstimado;
            fsali.setMinutes(fsali.getMinutes() +result.rows[0].tiempoestimado);
            var fechaSS = fsali.toISOString();
            var separarr = fechaSS.split('T');
            var fechaaa = separarr[0].split('-');
            var horasss = separarr[1].split(':');
            var fllegadaa = fechaaa[0]+"-"+fechaaa[1]+"-"+fechaaa[2];
            var hllegadaa = horasss[0]+":"+horasss[1]+":"+"00";

            //////////////////////////////
            console.log('aqui 3');
            console.log(fsalidaa, hsalidaa, fllegadaa, hllegadaa);
            //createRoute();
            //sumar estimado a la fecha
            let semaforo='Programada';
            let idRuta = await makeIdRoute();
            let text = 'SELECT createRuta_Configurada($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)';
            let values = [ruta.id_ruta,idRuta, ruta.conductor, ruta.id_vehicle, ruta.name_vehicle, ruta.id_trailer,ruta.name_trailer, ruta.shipment, fsalidaa, hsalidaa, fllegadaa, hllegadaa,semaforo,ruta.id_user];
             //ruta.db, ruta.id_end,ruta.name_end];ruta.id_route, ruta.name_route, SE VAN

            await pool.query(text, values);
////////////////////

        //         ///falta consultar los grupos////


        //     let text0 = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        //     let values0 = [ruta.id_user];//cambiado de req.body.id_user
        //     const result0 = await pool.query(text0, values0);



        //     for (var k=0; k<result0.rows[0].json_build_object.grupo.length;k++){
        //         let text3= 'SELECT createUsuario_Ruta($1,$2,$3)';//preguntar ultimo valor 
        //         let values3= [ruta.id_user,idRuta,result0.rows[0].json_build_object.grupo[k].id_grupo];
        //         await pool.query(text3,values3);
        //    }



           /// ya no se realiza
            // for (let y = 0; y < ruta.checkpoints.length; y++) {
            //     let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3,$4)';
            //     let values2 = [idRuta, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto, ruta.id_user];
            //     await pool.query(text2, values2);
            // }
            res.json({ status: 'ok' });
        }
        if (rows.length >0) {
            for (var i = 0; i < rows.length; i++) {
                console.log('hola');
                response=false;
                if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (ruta.id_trailer == rows[i].id_trailer)) {
                    console.log('conductor/vehiculo repetido');
                    //var dDate = new Date(rows[i].fecha_salida);
                    var dDate = new Date(rows[i].fechainicioestimada);//fecha inicio
                    //var aDate = new Date(rows[i].fecha_llegada);
                    var aDate = new Date(rows[i].fechallegadaestimada)//fecha inicio estimada;//fecha llegada
                    console.log(dDate);//fecha de salida en la base de datos
                    console.log(rows[i].fechallegadaestimada);
                    //modificando mes menos 1   
                    var mesS=parseInt(ruta.fechaIni.mes) ;


                    ///separador de fechas//////////////////
                    // fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                    // fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                    // let fechaS = fsalida.toISOString();
                    // let separar = fechaS.split('T');
                    // let fechaa = separar[0].split('-');
                    // let horass = separar[1].split(':');
                    // let fsalidaa = fechaa[0] + "-" + fechaa[1] + "-" + fechaa[2];
                    // let hsalidaa = horass[0] + ":" + horass[1] + ":" + "00";
              ////////////////////
                     ///separador de fechas////////////////// sacar fecha de llegada y hora de llegada para eso esta el codigo
            //fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            // let fechaS = fsalida.toISOString();
            // let separar = fechaS.split('T');
            // let fechaa = separar[0].split('-');
            // let horass = separar[1].split(':');
            // let fsalidaa = fechaa[0]+"-"+fechaa[1]+"-"+fechaa[2];
            // let hsalidaa = horass[0]+":"+horass[1]+":"+"00";
            ////////////////////
            console.log('aqui 2');
            ////suma de tiempo estimado////////////
            console.log(result.rows[0].tiempoestimado);/////checar
            console.log(result.rows[0]['tiempoestimado']);
            let m= result.rows[0].tiempoEstimado;
            fsali.setMinutes(fsali.getMinutes() +result.rows[0].tiempoestimado);
            let fechaSS = fsali.toISOString();
            let separarr = fechaSS.split('T');
            let fechaaa = separarr[0].split('-');
            let horasss = separarr[1].split(':');
            let fllegadaa = fechaaa[0]+"-"+fechaaa[1]+"-"+fechaaa[2];
            let hllegadaa = horasss[0]+":"+horasss[1]+":"+"00";
            let hllegada= new Date (0,0,0,horasss[0],horasss[1]);
            let fllegada= new Date(fechaaa[0],fechaaa[1],fechaaa[2]);

            //////////////////////////////let









              /////////////////////////////////////////DESDE AQUI FUNCIONABA (mal horas)
                    // let fff=rows[i].fechallegadaestimada;
                    // let ff=fff.toISOString();
                    // let sep=ff.split('T');
                    // let separar = sep[0].split('-');

                    // //var mesL=parseInt(ruta.fechaFin.mes) ;
                    // var mesL=parseInt(separar[1]);//<--- mes fin estimado
                    // mesS=mesS-1;mesL=mesL-1;
                    // console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesS);
                    // console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesL);
                    // ///////////////////
                    fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
                    // fllegada = new Date(separar[0], separar[1]/*mesL*/, separar[2]);/////////se debe de sacar sumando los minutos no de la base de datos
                    // console.log(fsalida);
                    // console.log(fllegada);

                    // let hh=rows[i].horallegadaestimada;
                    // //let hh=hhh.toISOString();
                    // let separa= hh.split(':');

                    // let hllegada=new Date(0,0,0,separa[0],separa[1]);

                    //////////////////////HASTA AQUI
                   // fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);//debe ser la estimada
                   
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
                        var dates = rows[i].horainicioestimada.split(':');//hora inicio
                        var datel = rows[i].horallegadaestimada.split(':');//hora llegada o estimada
                        var dHour = new Date(0,0,0,dates[0],dates[1]);
                        var aHour = new Date(0,0,0,datel[0],datel[1]);


                        console.log(aHour);//1 y 4 si iguales de la base de datos a comparar llegar
                        console.log(dHour);//2 y 3 iguales de la base de datos a comparar salir
                        console.log(hsalida);// si esta tomada de lo enviado
                        /////////////suma de minutos a hllegada/////////////


                        /////////////////////////////
                        console.log(hllegada);// se debe sumar los minutos previamente
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
            // fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
            // fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
            // hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
            // hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
            //////////
              ///separador de fechas//////////////////
              fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
              fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
              let fechaS = fsalida.toISOString();
              let separar = fechaS.split('T');
              let fechaa = separar[0].split('-');
              let horass = separar[1].split(':');
              let fsalidaa = fechaa[0]+"-"+fechaa[1]+"-"+fechaa[2];
              let hsalidaa = horass[0]+":"+horass[1]+":"+"00";
              ////////////////////
              console.log('aqui 2');
              ////suma de tiempo estimado////////////
              console.log(result.rows[0].tiempoestimado);/////checar
              console.log(result.rows[0]['tiempoestimado']);
              let m= result.rows[0].tiempoEstimado;
              fsali.setMinutes(fsali.getMinutes() +result.rows[0].tiempoestimado);
              let fechaSS = fsali.toISOString();
              let separarr = fechaSS.split('T');
              let fechaaa = separarr[0].split('-');
              let horasss = separarr[1].split(':');
              let fllegadaa = fechaaa[0]+"-"+fechaaa[1]+"-"+fechaaa[2];
              let hllegadaa = horasss[0]+":"+horasss[1]+":"+"00";
  
              //////////////////////////////
            




            let semaforo='Programada';
           
             //r
             let text = 'SELECT createRuta_Configurada($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)';
             let values = [ruta.id_ruta,idRuta, ruta.conductor, ruta.id_vehicle, ruta.name_vehicle, ruta.id_trailer,ruta.name_trailer, ruta.shipment, fsalidaa, hsalidaa, fllegadaa, hllegadaa,semaforo,ruta.id_user];

            await pool.query(text, values);
            // saber como quedaron parametros de createRuta para meter endpoints
            //CREAR RUTA AL FINAL ID_ENDPOINT, NAME_ENDPOINT AL FINAL
                //pedir el grupo
           // select 
        //    console.log(ruta.id_user);
        //    let text0 = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        //    let values0 = [ruta.id_user];//cambiado de req.body.id_user
        //    const result0 = await pool.query(text0, values0);
           
        //    console.log('mas de uno');

        //    for (let k=0; k<result0.rows[0].json_build_object.grupo.length;k++){
        //         let text3= 'SELECT createUsuario_Ruta($1,$2,$3)';//preguntar ultimo valor 
        //         let values3= [ruta.id_user,idRuta,result0.rows[0].json_build_object.grupo[k].id_grupo];
        //         await pool.query(text3,values3);
        //    }
            //id: result.rows[0].json_build_object.grupo[j]
                //

                //para crear ruta con end point

                // for(cantidad de grupos);
                // let text3= 'SELECT createUsuario_Ruta(id_usuarioqueloestacreando,idRuta,grupo/sdeusuario)';//preguntar ultimo valor 
                // let values3= [ruta.id_user,idRuta,id.group];
                // await pool.query(text3,values3);
                //creara tantos usuarios como grupos


                    // for(let i=0; i<ruta.group.length;i++)
                    // {NO SE USARA
                    //     let text4=('SELECT setGrupo($1,$2');
                    //     let values4 = [ruta.email,group[i]];
                    //     await pool.query(text4,values4);     
                    // }
              //  }

                // 'SELECT createUsuario_Ruta(id_usuarioqueloestacreando,idRuta,grupo/sdeusuario)';
                // 'SELECT setGrupo($1,$2')
                // //checar que front si manda el id_user
                // grupos:{
                //     id:123123,
                //     id:123123.
                // }


           // await pool.query(text, values);

           //NO NECESARIO
            // console.log('antes',ruta.checkpoints[0].id_punto);
            // console.log(ruta.checkpoints.length);
            // console.log(ruta.checkpoints[0].id_punto);
            // for (let y = 0; y < ruta.checkpoints.length; y++) {
            //     let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
            //     let values2 = [idRuta, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto];
            //     await pool.query(text2, values2);
            // }
            console.log('despues');
            res.json({ status: 'ok' });
        }
    }
    catch (e) {
        console.log('ERROR CREANDO RUTAS' + e);
    }
};

//Edit Routes
qryCtrlRoutes.EditSpecificRoute = async (req, res) => {
    try {
        console.log(req.body);
         var ruta=req.body;
         console.log('editando ruta');
         let text=('SELECT * FROM ruta_configurada WHERE id_ruta!=$1');
         let values=[ruta.id_routep];
         var response= false;//ojo aquiiiiiiiiiiiiii///////////////////////////// y en la parte de arriba
         
         var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
        //var hllegada = new Date(0, 0, 0, ruta.horaFin.hora + ruta.horaFin.minutos);

         const {rows} = await pool.query(text,values);
//         console.log(rows);
        //  if(rows.length==0){
        //      res.json({status:'Not Found!'});
         //}//que no se compare con si misma
         if (rows.length >0) {
            for (var i = 0; i < rows.length; i++) {
                if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (ruta.id_trailer == rows[i].id_trailer)) {



                    console.log('conductor/vehiculo repetido');
                    //var dDate = new Date(rows[i].fecha_salida);
                    var dDate = new Date(rows[i].fechainicioestimada);//fecha inicio
                    //var aDate = new Date(rows[i].fecha_llegada);
                    var aDate = new Date(rows[i].fechallegadaestimada)//fecha inicio estimada;//fecha llegada
                    console.log(dDate);//fecha de salida en la base de datos
                    console.log(rows[i].fechallegadaestimada);
                    //modificando mes menos 1   
                    var mesS=parseInt(ruta.fechaIni.mes) ;


                    ///separador de fechas//////////////////
                    // fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                    // fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                    // let fechaS = fsalida.toISOString();
                    // let separar = fechaS.split('T');
                    // let fechaa = separar[0].split('-');
                    // let horass = separar[1].split(':');
                    // let fsalidaa = fechaa[0] + "-" + fechaa[1] + "-" + fechaa[2];
                    // let hsalidaa = horass[0] + ":" + horass[1] + ":" + "00";
              ////////////////////
                     ///separador de fechas////////////////// sacar fecha de llegada y hora de llegada para eso esta el codigo
            //fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            // let fechaS = fsalida.toISOString();
            // let separar = fechaS.split('T');
            // let fechaa = separar[0].split('-');
            // let horass = separar[1].split(':');
            // let fsalidaa = fechaa[0]+"-"+fechaa[1]+"-"+fechaa[2];
            // let hsalidaa = horass[0]+":"+horass[1]+":"+"00";
            ////////////////////
            console.log('aqui 2');
            ////suma de tiempo estimado////////////
            console.log(result.rows[0].tiempoestimado);/////checar
            console.log(result.rows[0]['tiempoestimado']);
            let m= result.rows[0].tiempoEstimado;
            fsali.setMinutes(fsali.getMinutes() +result.rows[0].tiempoestimado);
            let fechaSS = fsali.toISOString();
            let separarr = fechaSS.split('T');
            let fechaaa = separarr[0].split('-');
            let horasss = separarr[1].split(':');
            let fllegadaa = fechaaa[0]+"-"+fechaaa[1]+"-"+fechaaa[2];
            let hllegadaa = horasss[0]+":"+horasss[1]+":"+"00";
            let hllegada= new Date (0,0,0,horasss[0],horasss[1]);
            let fllegada= new Date(fechaaa[0],fechaaa[1],fechaaa[2]);

            //////////////////////////////let









              /////////////////////////////////////////DESDE AQUI FUNCIONABA (mal horas)
                    // let fff=rows[i].fechallegadaestimada;
                    // let ff=fff.toISOString();
                    // let sep=ff.split('T');
                    // let separar = sep[0].split('-');

                    // //var mesL=parseInt(ruta.fechaFin.mes) ;
                    // var mesL=parseInt(separar[1]);//<--- mes fin estimado
                    // mesS=mesS-1;mesL=mesL-1;
                    // console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesS);
                    // console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesL);
                    // ///////////////////
                    fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
                    // fllegada = new Date(separar[0], separar[1]/*mesL*/, separar[2]);/////////se debe de sacar sumando los minutos no de la base de datos
                    // console.log(fsalida);
                    // console.log(fllegada);

                    // let hh=rows[i].horallegadaestimada;
                    // //let hh=hhh.toISOString();
                    // let separa= hh.split(':');

                    // let hllegada=new Date(0,0,0,separa[0],separa[1]);

                    //////////////////////HASTA AQUI
                   // fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);//debe ser la estimada
                   
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
                        var dates = rows[i].horainicioestimada.split(':');//hora inicio
                        var datel = rows[i].horallegadaestimada.split(':');//hora llegada o estimada
                        var dHour = new Date(0,0,0,dates[0],dates[1]);
                        var aHour = new Date(0,0,0,datel[0],datel[1]);


                        console.log(aHour);//1 y 4 si iguales de la base de datos a comparar llegar
                        console.log(dHour);//2 y 3 iguales de la base de datos a comparar salir
                        console.log(hsalida);// si esta tomada de lo enviado
                        /////////////suma de minutos a hllegada/////////////


                        /////////////////////////////
                        console.log(hllegada);// se debe sumar los minutos previamente
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



//                     console.log('conductor/vehiculo repetido');
//                     var dDate = new Date(rows[i].fecha_salida);
//                     var aDate = new Date(rows[i].fecha_llegada);
//                     console.log(dDate);
//                     console.log(rows[i].fecha_llegada);
//                     var mesS=parseInt(ruta.fechaIni.mes) ;
//                     var mesL=parseInt(ruta.fechaFin.mes) ;
//                     mesS=mesS-1;mesL=mesL-1;
//                     var fsalida = new Date(ruta.fechaIni.anio, mesS, ruta.fechaIni.dia);
//                     var fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);
//                     //fsalida.setMonth(+1);
//                     //fllegada.setMonth(+1);
//                     console.log(fsalida);
//                     console.log(fllegada);
//                     console.log('fechas');
//                     console.log(dDate.getTime());
//                     console.log(fsalida.getTime());
//                     console.log(aDate.getTime());
//                     console.log(fllegada.getTime());
//                     if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
//                         console.log('entre fechas');
//                         var dates = rows[i].hora_salida.split(':');
//                         var datel = rows[i].hora_llegada.split(':');
//                         var dHour = new Date(0,0,0,dates[0],dates[1]);
//                         var aHour = new Date(0,0,0,datel[0],datel[1]);
// //                         console.log(aHour);
// //                         console.log(dHour);
// //                     console.log(rows[0].hora_llegada);
// //                     console.log(hsalida);
// //                     console.log(dHour);
// //                     console.log(aHour);
// // //                    console.log(i);
// //                         if ((hsalida >= dHour && hsalida <= aHour) ||
// //                             (hllegada >= dHour && hllegada <= aHour)) {
// //                                 console.log('ultima parte');
// //                             response= true;
// //                             res.json({ status: 'Horarios Incompatibles' });
// //                         }
//                         console.log(hsalida.getTime());
//                         console.log(hllegada.getTime());
//                         console.log(dHour.getTime());
//                         console.log(aHour.getTime());
                        
//                             if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
//                                 ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
//                                     console.log('ultima parte');
//                                 response= true;
//                                 res.json({ status: 'Horarios Incompatibles' });
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


                  ///separador de fechas//////////////////
                  fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                  fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                  let fechaS = fsalida.toISOString();
                  let separar = fechaS.split('T');
                  let fechaa = separar[0].split('-');
                  let horass = separar[1].split(':');
                  let fsalidaa = fechaa[0]+"-"+fechaa[1]+"-"+fechaa[2];
                  let hsalidaa = horass[0]+":"+horass[1]+":"+"00";
                  ////////////////////
                  console.log('aqui 2');
                  ////suma de tiempo estimado////////////
                  console.log(result.rows[0].tiempoestimado);/////checar
                  console.log(result.rows[0]['tiempoestimado']);
                  let m= result.rows[0].tiempoEstimado;
                  fsali.setMinutes(fsali.getMinutes() +result.rows[0].tiempoestimado);
                  let fechaSS = fsali.toISOString();
                  let separarr = fechaSS.split('T');
                  let fechaaa = separarr[0].split('-');
                  let horasss = separarr[1].split(':');
                  let fllegadaa = fechaaa[0]+"-"+fechaaa[1]+"-"+fechaaa[2];
                  let hllegadaa = horasss[0]+":"+horasss[1]+":"+"00";
      
                  //////////////////////////////    
                let semaforo='Programada';
                let text = 'SELECT updateRuta_configurada($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)';//ver si Daniel actualizo
                //se agrego status pedirlo para editar ruta y id de ruta propia
                let values = [ruta.id_ruta_configurada, ruta.conductor, ruta.id_vehicle,
                    ruta.name_vehicle, ruta.id_trailer, ruta.name_trailer, ruta.shipment, fsalidaa, hsalidaa, fllegadaa, hllegadaa,ruta.status, semaforo];
                    //ruta.id_end,ruta.name_end];
                await pool.query(text, values);

                // create or replace function updateRuta_configurada(
                //     ide_ruta_configurada varchar(60),
                //     _Conductor varchar(200),
                //     ide_vehiculo varchar(60),
                //     _Vehiculo varchar(200),
                //     ide_trailer varchar(60),
                //     _Trailer varchar(200),
                //     _Shipment varchar(60),
                //     fInicio DATE,
                //     hInicio TIME,
                //     fEstimada DATE,
                //     hEstimada TIME,
                //     stdo varchar(60),
                //     ide_semaforo varchar(60)
                //     )


               
               // changeState(ide_ruta_configurada varchar(60), stdo varchar(60))
                
                

                    //NO NECESARIO CP
                // console.log('ruta bn');
                // var nullHora=null;
                // var nullFecha=null;
                // let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta=$1";
                // let values2=[ruta.id_routep];
                // await pool.query(text2,values2);
                // const {rows}=await pool.query('SELECT * FROM Ruta_Checkpoint');
                // console.log(rows);
                // console.log('borro');
                // for (let y = 0; y < ruta.checkpoints.length; y++) {
                //     //let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
                //     let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
                //     //pedir hora y fecha ya que lo solicita la db
                //     let values2 = [ruta.id_routep, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto];//,nullFecha,nullHora];//,ruta.checkpoints[y].fecha,ruta.checkpoints[y].hora];
                //     await pool.query(text2, values2);
                }
                res.json({ status: 'ok' });
            }
    catch (e) {
        console.log('ERROR EDITANDO RUTAS' + e);
    }
};


//Delete Route toda configurada
qryCtrlRoutes.DeleteSpecificRoute = async (req, res) => {
    try {
        console.log(req.params);
         let text=('SELECT deleteRuta_configurada($1)');
         let values=[req.params.id_route];
         await pool.query(text,values);
        res.json({status:'ok'});
    }
    catch (e) {
        console.log('ERROR BORRANDO RUTAS CONFIGURADAS' + e);
    }
};


qryCtrlRoutes.CreateRoute = async (req,res)=>{
    try{
        var Ruta=req.body;
        let idRuta = await makeIdRoute();
        console.log(req.body);
        console.log(Ruta.id_end);
        text="SELECT createRuta_catalogo($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        values=[idRuta,Ruta.id_route,Ruta.name_catalogo,Ruta.name_route,Ruta.id_start,Ruta.name_start,Ruta.id_end,Ruta.name_end,Ruta.tEstimado,Ruta.db];
        await pool.query(text,values);

        for (let y = 0; y < Ruta.checkpoints.length; y++) {
            let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
            let values2 = [idRuta, Ruta.checkpoints[y].id_punto, Ruta.checkpoints[y].name_punto];
            await pool.query(text2, values2);
        }
/////agregado////////////////////////
        console.log(Ruta.id_user);
        let text0 = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values0 = [Ruta.id_user];//cambiado de req.body.id_user
        const result0 = await pool.query(text0, values0);
        
        console.log('mas de uno');

        for (let k=0; k<result0.rows[0].json_build_object.grupo.length;k++){
             let text3= 'SELECT createUsuario_Ruta($1,$2,$3)';//preguntar ultimo valor 
             let values3= [Ruta.id_user,idRuta,result0.rows[0].json_build_object.grupo[k].id_grupo];
             await pool.query(text3,values3);
        }


        res.json('ok!');
    }catch (e){
        console.log(e);
    }
};


qryCtrlRoutes.EditRoute = async (req,res)=>{
    try{
        var Ruta=req.body;
        text="SELECT updateRuta_catalogo($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        values=[Ruta.id_ruta_catalogo,Ruta.id_route,Ruta.name_catalogo,Ruta.name_route,Ruta.id_start,Ruta.name_start,Ruta.id_end,Ruta.name_end,Ruta.tEstimado,Ruta.db];
        await pool.query(text,values);

        
        let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta_catalogo=$1";
        let values2 = [Ruta.id_ruta_catalogo];
        await pool.query(text2, values2);
        const { rows } = await pool.query('SELECT * FROM Ruta_Checkpoint');
        console.log('borro');
        for (let y = 0; y < Ruta.checkpoints.length; y++) {
            let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
            let values2 = [Ruta.id_ruta_catalogo, Ruta.checkpoints[y].id_punto, Ruta.checkpoints[y].name_punto];
            await pool.query(text2, values2);
        }
        res.json('ok!');
    }catch (e){
        console.log(e);
    }
};

qryCtrlRoutes.QueryCatalogRoute = async (req, res) => {
    try {
        let text=('SELECT * FROM verRuta_Catalogo WHERE BD = $1');
        let values=[req.body.db];
        const {rows}=await pool.query(text,values);
        res.json(rows);
    }catch(e){
        console.log('ERROR QUERY CATALOGO',e);
    }
};




qryCtrlRoutes.QueryCatalogRouteSpecific = async (req, res) => {
    try {
        let text=('SELECT * FROM verRuta_Catalogo WHERE BD = $1');
        let values=[req.body.db];
        const {rows}=await pool.query(text,values);
        var rutas_catalogo=[]
        for(let i=0; i<rows.length;i++){
            rutas_catalogo.push({id: rows[i].id_ruta_catalogo ,name: rows[i].nombreruta});
        }
        res.json(rutas_catalogo);   
    }catch(e){
        console.log('ERROR QUERY CATALOGO ESPECIFICA',e);
    }
};



qryCtrlRoutes.QueryGroup = async (req,res)=>{
    try{
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        var groups=[];
        for (var i=0; i<result.rows[0].json_build_object.grupo.length;i++){
            groups.push({id:result.rows[0].json_build_object.grupo[i].id_grupo,
                name:result.rows[0].json_build_object.grupo[i].nombreGrupo});
        }
        res.json({groups});
    }catch(e){
        console.log('ERROR QUERY GROUPS',e);
    }
};


//Delete Route catalogo
qryCtrlRoutes.DeleteRoute = async (req, res) => {
    try {
        console.log(req.params);
         let text=('SELECT deleteRuta_catalogo($1)');
         let values=[req.params.id_route];
         await pool.query(text,values);
        res.json({status:'ok'});
    }
    catch (e) {
        console.log('ERROR BORRANDO RUTAS CATALOGO' + e);
    }
};


//Show All by db
qryCtrlRoutes.QueryAll = async (req, res) => {
    try {
        ////////////////JALANDO PUNTOS/////////////

        if (req.body.queryConfig == true) {


           // let text = ('SELECT * FROM verRutasyCheckpoints WHERE BD = ($1)');
            let text = ('SELECT * FROM verruta_completa WHERE BD=$1');
            //completas
            let values = [req.body.db];
            const { rows } = await pool.query(text, values);
            res.json({ rows });
        }
        else {

        var api;
       
        console.log('QALL');
        if (req.body.db == "metrica") {
            api = await conexion.updateSessionId();
            //console.log(api);
        }
        else {
            console.log('Otra base de datos');
            //registros tomados de github documentacion db
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }

        //////JALAR TODO DE LAS RUTAS///////
        console.log('entro qall');
        //let text = 'SELECT * FROM verRutasyCheckpoints where BD = $1';
        //let text = ('SELECT * FROM ruta_configurada WHERE id_ruta_catalogo = (SELECT id_ruta_catalogo FROM ruta_catalogo WHERE DB = $1)');
        let text = ('SELECT * FROM verruta_completa WHERE BD=$1');
        let values = [req.body.db];
        const { rows } = await pool.query(text, values);
        console.log('paso qall');
///////////////////
//////acceso a los id de ruta, end point y checkpoint////
// result.rows[0].id_rutageotab;//id para consulta de puntos de ruta
// result.rows[0].json_build_object.ruta[0].id_checkpoint;//id para consulta de checkpoints
// result.rows[0].id_endpoint;//id para consulta de endpoints
// ////fin de acceso/////

    console.log(rows.length);
    console.log(rows[0]);
            //todo junto///////
            var completeRoute=[];
            for(var j=0;j<rows.length;j++){//cantidad de resultados de ruta completos
//end pointsvar 
//                ctrlCP=rows[j].json_build_object.ruta.length;
                console.log('apicalls');
                const zonesEndPoints= await api.call("Get",{
                    typeName: "Zone",
                    search: {//como se cambio se agrega el id para filtrar
                        //id: [{id:rows[j].id_endpoint/*id:zones[0].id*/}]
                        id:rows[j].id_endpoint
                    }
                });
                
                var EndPoints = [];
                console.log('End'+zonesEndPoints.length);
               // console.log(zonesEndPoints[0]);
                for (i = 0; i < zonesEndPoints.length; i++) {
                    //if (zonesEndPoints[i].groups[0] != null) {
                       // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
                            EndPoints.push({  points: zonesEndPoints[i].points });
                      //  }
                }
                //fin endpoints
                //inicio startpoints
                const zonesStartPoints= await api.call("Get",{
                    typeName: "Zone",
                    search: {//como se cambio se agrega el id para filtrar
                        //id: [{id:rows[j].id_endpoint/*id:zones[0].id*/}]
                        id:rows[j].id_startpoint
                    }
                });
                
                var StartPoints = [];
                console.log('Start'+zonesStartPoints.length);
               // console.log(zonesEndPoints[0]);
                for (i = 0; i < zonesStartPoints.length; i++) {
                    //if (zonesEndPoints[i].groups[0] != null) {
                       // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
                            StartPoints.push({  points: zonesStartPoints[i].points });
                      //  }
                }
                //fin startpoints
                //inicio rutaspoints
                console.log('startpoints');
                //console.log(EndPoints);
                const zonesRoutePoints= await api.call("Get",{
                    typeName: "Zone",
                    search: {//como se cambio se agrega el id para filtrar
                       // id: [{id:rows[j].id_rutageotab/*id:zones[0].id*/}]
                       id:rows[j].id_rutageotab
                    }
                });
                var RoutePoints=[];
                console.log('Route'+zonesRoutePoints.length);
                for ( i = 0; i < zonesRoutePoints.length; i++) {
                   /// if (zonesRoutePoints[i].groups[0] != null) {
                       // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
                            RoutePoints.push({  points: zonesRoutePoints[i].points });
                      //  }
                    }
                    console.log('routepoints');
                //console.log(RoutePoints);
                //fin rutas points
                //inicio checkpoints
                var CheckPoints=[];
                for (var k = 0; k < rows[j].json_build_object.ruta.length; k++) {//cantidad de checkpoints en esa ruta que va corriendo
                    const zonesCheckPoints = await api.call("Get", {
                        typeName: "Zone",
                        search: {//como se cambio se agrega el id para filtrar
                            //id: [{ id: rows[j].json_build_object.ruta[k].id_checkpoint/*id:zones[0].id*/ }]
                            id: rows[j].json_build_object.ruta[k].id_checkpoint
                            
                        }
                    });

                    CheckPoints.push({id_checkpoint: rows[j].json_build_object.ruta[k].id_checkpoint, nombrecheckpoint: rows[j].json_build_object.ruta[k].nombrecheckpoint,
                        points: zonesCheckPoints[0].points, fecha: rows[j].json_build_object.ruta[k].fecha, hora:rows[j].json_build_object.ruta[k].hora });
     
                }
                //fin checkpoints
                console.log('checkpoints');
                //console.log(CheckPoints);
                console.log('ultimo push');

                completeRoute.push({id_ruta:rows[j].id_ruta_configurada,id_rutageotab:rows[j].id_rutageotab,nombreruta:rows[j].nombreruta,nombrerutageotab:rows[j].nombrerutageotab,RouteCoor: RoutePoints,//[j] se quito
                    conductor:rows[j].conductor,id_vehiculo:rows[j].id_vehiculo,vehiculo:rows[j].vehiculo,id_trailer:rows[j].id_trailer,
                    trailer:rows[j].trailer,shipment:rows[j].shipment,fecha_salida:rows[j].fechainicioestimada,hora_salida:rows[j].horainicioestimada,
                    fecha_llegada:rows[j].fechallegadaestimada,hora_llegada:rows[j].horallegadaestimada,estado:rows[j].estado,bd:rows[j].bd,
                    id_startpoint:rows[j].id_startpoint,startpoint:rows[j].startpoint,StartCoor:StartPoints,
                    id_endpoint:rows[j].id_endpoint,endpoint:rows[j].endpoint,EndCoor: EndPoints/*[j]*/, CheckPoints:CheckPoints});//CheckCoor: {CheckPoints}]}  };

                    console.log('vuelta #',j);
            }
        
            //////////fin todo junto/////////
///////////////////FIN SACAR PUNTOS////////////////
       
       
        console.log(completeRoute.length);
         res.json({ completeRoute });
        }
    }
    catch (e) {
        console.log('ERROR CONSULTANDO RUTAS CONFIGURADAS' + e);
    }
};



module.exports = qryCtrlRoutes;



//         console.log('ENDPOINTS');
//        // console.log(zones[0]);
//         const zonesEndPoints= await api.call("Get",{
//             typeName: "Zone",
//             search: {//como se cambio se agrega el id para filtrar
//                 zoneTypes: [{id:rows[0].id_endpoint/*id:zones[0].id*/}]
//             }
//         });
//         var EndPoints = [];
//         for (var i = 0; i < zonesEndPoints.length; i++) {
//             if (zonesEndPoints[i].groups[0] != null) {
//                // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
//                     EndPoints.push({  points: zonesEndPoints[i].points });
//                 }
//             }
//         const zonesRoutePoints= await api.call("Get",{
//             typeName: "Zone",
//             search: {//como se cambio se agrega el id para filtrar
//                 zoneTypes: [{id:rows[0].id_rutageotab/*id:zones[0].id*/}]
//             }
//         });
//         var RoutePoints=[];
//         for ( i = 0; i < zonesRoutePoints.length; i++) {
//             if (zonesRoutePoints[i].groups[0] != null) {
//                // if (zonesCheckPoints[i].groups[0].id == zones[0].id) { se quita pq ya filtro con lo nuevo
//                     RoutePoints.push({  points: zonesRoutePoints[i].points });
//                 }
//             }
//             //checkpoints
//             var CheckPoints=[];
//             for(var j=0;j<rows.length;j++){//cantidad de resultados de ruta completos
//                 for (var k = 0; k < result.rows[j].json_build_object.ruta[j].length; k++) {//cantidad de checkpoints en esa ruta que va corriendo
//                     const zonesCheckPoints = await api.call("Get", {
//                         typeName: "Zone",
//                         search: {//como se cambio se agrega el id para filtrar
//                             zoneTypes: [{ id: rows[j].json_build_object.ruta[k].id_checkpoint/*id:zones[0].id*/ }]
//                         }
//                     });
//                     CheckPoints.push({  points: zonesCheckPoints[0].points });
//                 }
//             }



// //Create Routes
// qryCtrlRoutes.CreateRoute = async (req, res) => {
//     try {
//         var ruta = req.body;
//         console.log(ruta);
//         console.log(ruta.fechaFin);
//         const {rows} = await pool.query('SELECT * FROM ruta');
//         console.log(rows[0]);
//         //el mes es el problema disminuir en 1 plz solo para donde se mete diferente/////////////////////////////
//         var fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
//         console.log(ruta.fechaIni.anio);
//         var fllegada = new Date(ruta.fechaFin.anio, ruta.fechaFin.mes, ruta.fechaFin.dia);
//         console.log(fsalida);
//                     console.log(fllegada);
//         // var dDate = new Date(ruta.fechaIni.anio,ruta.fechaIni.mes,ruta.fechaIni.dia,ruta.horaIni.hora,ruta.horaIni.minutos);
//         // var aDate = new Date(ruta.fechaFin.anio,ruta.fechaFin.mes,ruta.fechaFin.dia,ruta.horaFin.hora,ruta.horaFin.minutos);

//         var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
//         var hllegada = new Date(0, 0, 0, ruta.horaFin.hora, ruta.horaFin.minutos);
//         console.log(rows.length);
//         var response= null;
//         if (rows.length == 0) {
            
//             fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
//             fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
//             hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
//             hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
//             console.log('entre a sin registros');
//             console.log(hllegada);
//             console.log(fllegada);
//             //createRoute();
//             let idRuta = await makeIdRoute();
//             let text = 'SELECT createRuta($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)';
//             let values = [idRuta, ruta.id_route, ruta.name_route, ruta.conductor, ruta.id_vehicle,
//                 ruta.name_vehicle, ruta.id_trailer,ruta.name_trailer, ruta.shipment, fsalida, hsalida, fllegada, hllegada, ruta.db,
//             ruta.id_end,ruta.name_end];
//             await pool.query(text, values);

//                 ///falta consultar los grupos////


//             let text0 = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
//             let values0 = [ruta.id_user];//cambiado de req.body.id_user
//             const result0 = await pool.query(text0, values0);



//             for (var k=0; k<result0.rows[0].json_build_object.grupo.length;k++){
//                 let text3= 'SELECT createUsuario_Ruta($1,$2,$3)';//preguntar ultimo valor 
//                 let values3= [ruta.id_user,idRuta,result0.rows[0].json_build_object.grupo[k].id_grupo];
//                 await pool.query(text3,values3);
//            }




//             for (let y = 0; y < ruta.checkpoints.length; y++) {
//                 let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3,$4)';
//                 let values2 = [idRuta, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto, ruta.id_user];
//                 await pool.query(text2, values2);
//             }
//             res.json({ status: 'ok' });
//         }
//         if (rows.length >0) {
//             for (var i = 0; i < rows.length; i++) {
//                 console.log('hola');
//                 response=false;
//                 if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (ruta.id_trailer == rows[i].id_trailer)) {
//                     console.log('conductor/vehiculo repetido');
//                     var dDate = new Date(rows[i].fecha_salida);
//                     var aDate = new Date(rows[i].fecha_llegada);
//                     console.log(dDate);
//                     console.log(rows[i].fecha_llegada);
//                     //modificando mes menos 1   
//                     var mesS=parseInt(ruta.fechaIni.mes) ;
//                     var mesL=parseInt(ruta.fechaFin.mes) ;
//                     mesS=mesS-1;mesL=mesL-1;
//                     console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesS);
//                     console.log('MEEEEEEEEEEESSSSSSSSSSS'+mesL);
//                     ///////////////////
//                     fsalida = new Date(ruta.fechaIni.anio, mesS, ruta.fechaIni.dia);
//                     fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);
//                     //fsalida.setMonth(+1);
//                     //fllegada.setMonth(+1);
//                     console.log(fsalida);
//                     console.log(fllegada);
//                     console.log('fechas');
//                     console.log(dDate.getTime());//salida bd
//                     console.log(fsalida.getTime());//
//                     console.log(aDate.getTime());//llegada db
//                     console.log(fllegada.getTime());
//                     if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
//                         console.log('entre fechas');
//                         var dates = rows[i].hora_salida.split(':');
//                         var datel = rows[i].hora_llegada.split(':');
//                         var dHour = new Date(0,0,0,dates[0],dates[1]);
//                         var aHour = new Date(0,0,0,datel[0],datel[1]);
//                         console.log(aHour);//1 y 4 si iguales
//                         console.log(dHour);//2 y 3 iguales
//                         console.log(hsalida);
//                         console.log(hllegada);
//                     //console.log(rows[i].hora_llegada);
//                     console.log(hsalida.getTime());//1 y 3
//                     console.log(hllegada.getTime());//2 y 3
//                     console.log(dHour.getTime());
//                     console.log(aHour.getTime());
//                     console.log(i);
//                         if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
//                             ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
//                                 console.log('ultima parte');
//                             response= true;
//                             res.json({ status: 'Horarios Incompatibles' });
//                         }
//                     }
//                 }
//             }
//         }
//         if(response == false){
//             let idRuta = await makeIdRoute();
//             console.log(idRuta);
//             fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
//             fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
//             hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
//             hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
//             let text = 'SELECT createRuta($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)';
//             let values = [idRuta, ruta.id_route, ruta.name_route, ruta.conductor, ruta.id_vehicle,
//                 ruta.name_vehicle, ruta.id_trailer, ruta.name_trailer, ruta.shipment, fsalida, hsalida, fllegada, hllegada, ruta.db,
//             ruta.id_end,ruta.name_end];
//             const result = await pool.query(text, values);
// // saber como quedaron parametros de createRuta para meter endpoints
// //CREAR RUTA AL FINAL ID_ENDPOINT, NAME_ENDPOINT AL FINAL
//                 //pedir el grupo
//            // select 
//            console.log(ruta.id_user);
//            let text0 = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
//            let values0 = [ruta.id_user];//cambiado de req.body.id_user
//            const result0 = await pool.query(text0, values0);
           
//            console.log('mas de uno');

//            for (var k=0; k<result0.rows[0].json_build_object.grupo.length;k++){
//                 let text3= 'SELECT createUsuario_Ruta($1,$2,$3)';//preguntar ultimo valor 
//                 let values3= [ruta.id_user,idRuta,result0.rows[0].json_build_object.grupo[k].id_grupo];
//                 await pool.query(text3,values3);
//            }
//             //id: result.rows[0].json_build_object.grupo[j]
//                 //

//                 //para crear ruta con end point

//                 // for(cantidad de grupos);
//                 // let text3= 'SELECT createUsuario_Ruta(id_usuarioqueloestacreando,idRuta,grupo/sdeusuario)';//preguntar ultimo valor 
//                 // let values3= [ruta.id_user,idRuta,id.group];
//                 // await pool.query(text3,values3);
//                 //creara tantos usuarios como grupos


//                     // for(let i=0; i<ruta.group.length;i++)
//                     // {NO SE USARA
//                     //     let text4=('SELECT setGrupo($1,$2');
//                     //     let values4 = [ruta.email,group[i]];
//                     //     await pool.query(text4,values4);     
//                     // }
//               //  }

//                 // 'SELECT createUsuario_Ruta(id_usuarioqueloestacreando,idRuta,grupo/sdeusuario)';
//                 // 'SELECT setGrupo($1,$2')
//                 // //checar que front si manda el id_user
//                 // grupos:{
//                 //     id:123123,
//                 //     id:123123.
//                 // }


//            // await pool.query(text, values);
//             console.log('antes',ruta.checkpoints[0].id_punto);
//             console.log(ruta.checkpoints.length);
//             console.log(ruta.checkpoints[0].id_punto);
//             for (let y = 0; y < ruta.checkpoints.length; y++) {
//                 let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
//                 let values2 = [idRuta, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto];
//                 await pool.query(text2, values2);
//             }
//             console.log('despues');
//             res.json({ status: 'ok' });
//         }
//     }
//     catch (e) {
//         console.log('ERROR CREANDO RUTAS' + e);
//     }
// };




// //Edit Routes
// qryCtrlRoutes.EditRoute = async (req, res) => {
//     try {
//         console.log(req.body);
//          var ruta=req.body;
//          console.log('editando ruta');
//          let text=('SELECT * FROM ruta WHERE id_ruta!=$1');
//          let values=[ruta.id_routep];
//          var response= false;//ojo aquiiiiiiiiiiiiii///////////////////////////// y en la parte de arriba
         
//          var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
//         var hllegada = new Date(0, 0, 0, ruta.horaFin.hora + ruta.horaFin.minutos);

//          const {rows} = await pool.query(text,values);
// //         console.log(rows);
//         //  if(rows.length==0){
//         //      res.json({status:'Not Found!'});
//          //}//que no se compare con si misma
//          if (rows.length >0) {
//             for (var i = 0; i < rows.length; i++) {
//                 if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (ruta.id_trailer == rows[i].id_trailer)) {
//                     console.log('conductor/vehiculo repetido');
//                     var dDate = new Date(rows[i].fecha_salida);
//                     var aDate = new Date(rows[i].fecha_llegada);
//                     console.log(dDate);
//                     console.log(rows[i].fecha_llegada);
//                     var mesS=parseInt(ruta.fechaIni.mes) ;
//                     var mesL=parseInt(ruta.fechaFin.mes) ;
//                     mesS=mesS-1;mesL=mesL-1;
//                     var fsalida = new Date(ruta.fechaIni.anio, mesS, ruta.fechaIni.dia);
//                     var fllegada = new Date(ruta.fechaFin.anio, mesL, ruta.fechaFin.dia);
//                     //fsalida.setMonth(+1);
//                     //fllegada.setMonth(+1);
//                     console.log(fsalida);
//                     console.log(fllegada);
//                     console.log('fechas');
//                     console.log(dDate.getTime());
//                     console.log(fsalida.getTime());
//                     console.log(aDate.getTime());
//                     console.log(fllegada.getTime());
//                     if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
//                         console.log('entre fechas');
//                         var dates = rows[i].hora_salida.split(':');
//                         var datel = rows[i].hora_llegada.split(':');
//                         var dHour = new Date(0,0,0,dates[0],dates[1]);
//                         var aHour = new Date(0,0,0,datel[0],datel[1]);
// //                         console.log(aHour);
// //                         console.log(dHour);
// //                     console.log(rows[0].hora_llegada);
// //                     console.log(hsalida);
// //                     console.log(dHour);
// //                     console.log(aHour);
// // //                    console.log(i);
// //                         if ((hsalida >= dHour && hsalida <= aHour) ||
// //                             (hllegada >= dHour && hllegada <= aHour)) {
// //                                 console.log('ultima parte');
// //                             response= true;
// //                             res.json({ status: 'Horarios Incompatibles' });
// //                         }
//                         console.log(hsalida.getTime());
//                         console.log(hllegada.getTime());
//                         console.log(dHour.getTime());
//                         console.log(aHour.getTime());
                        
//                             if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
//                                 ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
//                                     console.log('ultima parte');
//                                 response= true;
//                                 res.json({ status: 'Horarios Incompatibles' });
//                             }
//                     }
//                 }
//             }
//             }
//             if(response == false){
//                 let fsalida=ruta.fechaIni.anio+"-"+ ruta.fechaIni.mes+"-"+ruta.fechaIni.dia;
//                 let fllegada=ruta.fechaFin.anio+"-"+ ruta.fechaFin.mes+"-"+ruta.fechaFin.dia;
//                 hsalida=ruta.horaIni.hora+":"+ruta.horaIni.minutos+":"+"00";
//                 hllegada=ruta.horaFin.hora+":"+ruta.horaFin.minutos+":"+"00";
//                 let text = 'SELECT updateRuta($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)';//ver si Daniel actualizo
//                 //se agrego status pedirlo para editar ruta y id de ruta propia
//                 let values = [ruta.id_routep, ruta.id_route, ruta.name_route, ruta.conductor, ruta.id_vehicle,
//                     ruta.name_vehicle, ruta.id_trailer, ruta.name_trailer, ruta.shipment, fsalida, hsalida, fllegada, hllegada,ruta.status, ruta.db,
//                     ruta.id_end,ruta.name_end];
//                 await pool.query(text, values);
//                 console.log('ruta bn');
//                 var nullHora=null;
//                 var nullFecha=null;
//                 let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta=$1";
//                 let values2=[ruta.id_routep];
//                 await pool.query(text2,values2);
//                 const {rows}=await pool.query('SELECT * FROM Ruta_Checkpoint');
//                 console.log(rows);
//                 console.log('borro');
//                 for (let y = 0; y < ruta.checkpoints.length; y++) {
//                     //let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
//                     let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
//                     //pedir hora y fecha ya que lo solicita la db
//                     let values2 = [ruta.id_routep, ruta.checkpoints[y].id_punto, ruta.checkpoints[y].name_punto];//,nullFecha,nullHora];//,ruta.checkpoints[y].fecha,ruta.checkpoints[y].hora];
//                     await pool.query(text2, values2);
//                 }
//                 res.json({ status: 'ok' });
//             }
//         }
//     catch (e) {
//         console.log('ERROR EDITANDO RUTAS' + e);
//     }
//}