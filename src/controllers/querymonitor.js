const qryCtrlMonitor = {};
const { query } = require('express');
const conexion = require('../conexion');
const { pool } = require('../database');





//Edicion Checkpoints sin Registrar
qryCtrlMonitor.EditCheckPoint = async (req, res) => {

    try {
        console.log(req.body);
         var checkpoints=req.body;
         let text=('SELECT * FROM ruta_checkpoint WHERE id_ruta=$1');
         let values=[checkpoints.id_routep];
         const {rows} = await pool.query(text,values);
         console.log(rows.length);
         console.log(rows[0]);
         let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta=$1";
        let values2=[checkpoints.id_routep];
        await pool.query(text2,values2);
        console.log('borro');
         if(rows.length==0){
             res.json({status:'Not Found!'});
         }
         else{
            for (let y = 0; y < checkpoints.checkpoints.length; y++) {
                //let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
                let text2 = 'INSERT INTO Ruta_Checkpoint VALUES ($1,$2,$3,$4,$5)';
                // let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';    
                //pedir hora y fecha ya que lo solicita la db para ingresar manualmente funcionando ver formatos fecha y hora al pedir
                let values2 = [checkpoints.id_routep, checkpoints.checkpoints[y].id_punto, checkpoints.checkpoints[y].name_punto,checkpoints.checkpoints[y].fecha,checkpoints.checkpoints[y].hora];
                await pool.query(text2, values2);
            }
            res.json({ status: 'ok' });
         }
        }
        catch(e){
            console.log('ERROR EDITANDO CP Monitor',e);
        }
};

/*
metodo sumar horas (minutos)
var fecha = new Date(fechaoriginalconhorasqueselesumara);//formato'2019-09-13T06:45:00Z'
minutoSumar = 4000;//cantidad estimada de duracion de la ruta

console.log(fecha);//valor original

if (minutoSumar != 0) {
    fecha.setMinutes(fecha.getMinutes() + minutoSumar);//se suman los minutos

    console.log(fecha);//nuevo valor, quiza usar el metodo ISO para cambiar a formato largo
}

*/ 

// Info Device especifico
qryCtrlMonitor.QueryDevice = async (req, res) => {

    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
        }
        else {
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }
        var coordinates = [];
        var ff = new Date();
        console.log(ff);
        //        ff.setUTCHours(-2);
        var startDate = ff.toISOString();
        console.log(startDate);///este renglon y siguiente dan iguales
        var a = false;
        var objFecha = new Date();
        console.log(objFecha.getUTCDate() + "/" + objFecha.getUTCMonth() + "/" + objFecha.getUTCFullYear());
        console.log(objFecha.getUTCHours() + ":" + objFecha.getUTCMinutes() + ":" + objFecha.getUTCSeconds());
        var token = null;
        while (a == false) {
   //aqui estaba el sleep         
            await api.call('GetFeed', { typeName: 'LogRecord', fromVersion: token, search: 
            { deviceSearch: { id: req.body.id_device }, fromDate: startDate } })/*, toDate: '2020-01-01T00:01:00' */
                .then(result => {
                    //result.forEach(
                    console.log(result.length);
                    console.log(result.data.length);
                    console.log(result.toVersion);
                    token = result.toVersion;

                    for (var m = 0; m < result.data.length; m++) {
                        coordinates.push({
                            x: result.data[m].longitude,
                            y: result.data[m].latitude, speed: result.data[m].speed,
                            device: result.data[m].device, date: result.data[m].dateTime
                        });
                        a = true;

                    }
                    //revisar el sleep dentro de una funcion
                }).catch(error => console.log('ERROR NO ENCONTRADO VEHICULO', error));
                await sleep(1000);//MAXIMO 60 queries por minuto o da error//estaba enseguida del while
            }
            res.json({deviceInfo:coordinates});

    }catch(e){  
        console.log('ERROR Device INFO',e);
    }
    };


//Consulta Rules & Exceptions
//cada minuto respuestas
qryCtrlMonitor.QueryExceptions = async (req, res) => {
    //mandaria toda la lista de la tabla
    //escuchando un poco de tiempo  antes, cuando se consulta sale el id de la zona especifica
    //buscar todas las rutas con el estatus de progreso en nuestra db
    //mm routes que entre en cualquiera del mapa
    //REVISAR EL AGREGADO DE ZONA DE INICIO, REVISAR AGREGADO ENTRANDO CHECKPOINT Y ENTRANDO ENDPOINT*********
    //preguntar tiempo de consulta de los vehiculos puede ser en tiempo real ya que si habra datos.
    //PEDIR A DB que guarde el estado del semaforo para poner IF antes de entrar a una verificacion como "PUNTO INICIO"
    //EN DB guardar si ya termino para que quede omitida en la consulta de la linea 120 donde se consulta db y el status y filtrar
    
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        if (result.rows[0].bd == "metrica") {
            api = await conexion.updateSessionId();
        }
        else {
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        }

        //pedir la lista de datos de la db
        let text1 = ('SELECT * FROM verRutasyCheckpoints WHERE BD = ($1)');//query de DB = corresponde Y status en progreso o por arrancar
        let values1 = [req.body.db];
        const { rows } = await pool.query(text1, values1);
        /////

        const idRuleEntrandoStart = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Startpoint'
            },
        })
        console.log(idRuleEntrandoStart);
        console.log(idRuleEntrandoStart[0].id);

        const idRuleEntrando = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Dentro de MM-Routes'
            },
        })
        console.log(idRuleEntrando);
        console.log(idRuleEntrando[0].id);

        const idRuleSaliendo = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Saliendo de MM-Routes'
            },
        })
        console.log(idRuleSaliendo);
        console.log(idRuleSaliendo[0].id);


        const idRuleDentro = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Dentro de MM-Routes'
            },
        })
        console.log(idRuleDentro);
        console.log(idRuleDentro[0].id);


        const idRuleFuera = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Fuera de MM-Routes'
            },
        })
        console.log(idRuleFuera);
        console.log(idRuleFuera[0].id);


        const idRuleEntrandoEP = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Endpoint'
            },
        })
        console.log(idRuleEntrandoEP);
        console.log(idRuleEntrandoEP[0].id);



        const idRuleEntrandoCP = await api.call("Get", {
            typeName: "Rule",// filetipe RUle
            search: {
                name: 'Entrando a MM-Checkpoint'
            },
        })
        console.log(idRuleEntrandoCP);
        console.log(idRuleEntrandoCP[0].id);
        
        
        var Alerts=[];
        //horaActual sacarla en UTC 0, ver otro archivo para referencia
        //ciclo  para comparar cada device y su ubicacion
        for (var j = 0; j < rows.length; j++) {

            if(rows[j].status == 'por arrancar'){
            //ENTRANDO A ZONA INICIO
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleEntrandoStart[0].id }, fromDate: rows[j].fechaInicioRuta//poner fecha de cuando va a arrancar
                }, 
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if(result.data.length>0){
                        console.log(result.data[0]);

                        var horaEstimadaActual = new Date(result.data.activeFROM);//formato'2019-09-13T06:45:00Z'
                        console.log(horaEstimadaActual);//valor original
                        horaEstimadaActual.setMinutes(horaEstimadaActual.getMinutes() + rows[j].tiempoEstimado);//se suman los minutos

                        if(rows[j].horaFinal.getTime()<horaEstimadaActual.getTime()){
                            //hacer un push para meter datos de quien entro a la ruta
                        Alerts.push({ info:'A', id_route:rows[j].id_route, data:result.data[0] });
                            //hacer un update a la ruta para decir que esta en progreso
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Amarillo',horaRealinicio='result.data.activeFROM'");
                            //poner ademas las alertas con la hora en la base de datos porque queda un historico
                            //consultar db y se muestran las alertas
                        }
                        else{
                            Alerts.push({ info:'V', id_route:rows[j].id_route, data:result.data[0] });
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Verde',horaRealinicio='result.data.activeFROM'");
                        }
                        

                    }
                }).catch(error => console.log('ENTRANDO ERROR ', error));

            }

            if(rows[j].status == 'en progreso'){
            //ENTRANDO A MM ROUTES
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleEntrando[0].id }, fromDate: '2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if(result.data.length>0){
                        console.log(result.data[0]);
                        ///////////////////////
                        ////////////////////////
                        //LA LOGICA AQUI CREO NO IRIA TODO EL PARRAFO PUESTO ESTA EL PUNTO DE INICIO
                        //hacer un push para meter datos de quien entro a la ruta quiza esto no para jalar de la db directamente
                        
                        Alerts.push({ info:'En Curso', id_route:rows[j].id_route, data:result.data[0] });
                            //hacer un update a la ruta para decir que esta en progreso
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso'");
                            //poner ademas las alertas con la hora en la base de datos porque queda un historico
                            //consultar db y se muestran las alertas
                    }
                }).catch(error => console.log('ENTRANDO ERROR ', error));


                 //SALIENDO DE MM ROUTES
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleSaliendo[0].id }, fromDate: rows[j],horaRealInicio//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if(result.data.length>0){
                        console.log(result.data[0]);
                        if(rows[j].status=='Amarillo'){
                            //hacer un update a la ruta para decir que la ruta se salio
                            Alerts.push({semaforo:'R/A',data:result.data});
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Rojo/Amarillo',horaenquesucedio='result.data.activeFROM'");
                            //poner ademas las alertas con la hora en la base de datos porque queda un historico
                            //consultar db y se muestran las alertas
                       }
                       if(rows[j].status=='Verde'){
                            Alerts.push({semaforo:'V/R',data:result.data});
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Verde/Rojo',horaenquesucedio='result.data.activeFROM'");
                            //tiempo pero con salidas, se registra la salida con su hora, fecha y el vehiculo que lo hizo en esa ruta
                          //  pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Verde/Rojo',horaRealinicio='result.data.activeFROM'");
                        }
                    }

                }).catch(error => console.log('SALIENDO ERROR ', error));


            //DENTRO MM ROUTES
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleDentro[0].id }, fromDate: '2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if (result.data.length > 0) {
                        console.log(result.data[0]);
                        Alerts.push({info:'En Ruta',data:result.data});
                        //hacer un push para meter datos de quien salio a la ruta
                    }
                }).catch(error => console.log('DENTRO ERROR ', error));


            //FUERA MM ROUTES
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleFuera[0].id }, fromDate: '2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if (result.data.length > 0) {
                        console.log(result.data[0]);
                            Alerts.push({info:'Fuera de Ruta',data:result.data});
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso',info='fuera de ruta',horadelsuceso='result.data.activeFROM'");
                            //poner ademas las alertas con la hora en la base de datos porque queda un historico
                            //consultar db y se muestran las alertas
                        }
                }).catch(error => console.log('FUERA ERROR ', error));


            //ENTRANDO CHECKPOINT
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleEntrandoCP[0].id }, fromDate: '2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if (result.data.length > 0) {
                        console.log(result.data[0]);
                            Alerts.push({info:'Entrando a CP',data:result.data});//fecha vehiculo si se puediera zona, hora
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='ROjo/Amarillo',horaRealinicio='result.data.activeFROM'");
                    }
                }).catch(error => console.log('ENTRANDO CHECKPOINT ERROR ', error));


            //ENTRANDO ENDPOINT
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleEntrandoEP[0].id }, fromDate: '2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                .then(result => {
                    //result.forEach(
                    console.log(result);
                    console.log(result.data.length);
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    if (result.data.length > 0) {
                        console.log(result.data[0]);
                        Alerts.push({ info: 'Llegando a Destino', data: result.data });
                        if ((rows[j].horaFinal.getTime() <= horaActual.getTime()) && rows[j].semaforo != 'A') {
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='verde',horaRealLlegada='result.data.activeFROM'");
                        }
                        if ((rows[j].horaFinal.getTime() <= horaActual.getTime()) && rows[j].semaforo == 'A') {
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='rojo/verde',horaRealLlegada='result.data.activeFROM'");
                        }
                        if ((rows[j].horaFinal.getTime() > horaActual.getTime()) && rows[j].semaforo == 'A') {
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='rojo/amarillo',horaRealLlegada='result.data.activeFROM'");
                        }
                        if ((rows[j].horaFinal.getTime() > horaActual.getTime()) && rows[j].semaforo != 'A') {
                            pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='rojo',horaRealLlegada='result.data.activeFROM'");
                        }
                }
                }).catch(error => console.log('ENTRANDO ENDPOINT ERROR ', error));
            }

                res.json(Alerts);
        }
    }
    catch (e) {
        console.log('ERROR QUERY EXCEPTIONS', e);
    }
};


module.exports = qryCtrlMonitor;