const qryCtrlMonitor = {};
//const { query } = require('express');
const conexion = require('../conexion');
const { pool } = require('../database');


const util = require('util');//convertir codigo
const sleep = util.promisify(setTimeout);


//Edicion Checkpoints sin Registrar
qryCtrlMonitor.EditCheckPoint = async (req, res) => {

    try {
        console.log(req.body);
         var checkpoints=req.body;
         let text=('SELECT * FROM ruta_checkpoint WHERE id_ruta_catalogo=$1');//id_ruta_catalogo???
         let values=[checkpoints.id_routep];//cambio
         const {rows} = await pool.query(text,values);
         console.log(rows.length);
         console.log(rows[0]);
         let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta_catalogo=$1";
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
        console.log(req.body);
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        // if (result.rows[0].bd == "metrica") {
        //     api = await conexion.updateSessionId();
        // }
        // else {
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        //}
        var coordinates = [];
        var ff = new Date();
        console.log(ff);
        //        ff.setUTCHours(-2);
        var startDate = ff.toISOString();
        console.log(startDate);///este renglon y siguiente dan iguales
        var a = 0;
        var objFecha = new Date();
        console.log(objFecha.getUTCDate() + "/" + objFecha.getUTCMonth() + "/" + objFecha.getUTCFullYear());
        console.log(objFecha.getUTCHours() + ":" + objFecha.getUTCMinutes() + ":" + objFecha.getUTCSeconds());
        var token = null;
       while (a < 4) { //se quito el while porque es peligroso quedarse corriendo
      //aqui estaba el sleep//MAXIMO 60 queries por minuto o da error//estaba enseguida del while   
            await api.call('GetFeed', { typeName: 'LogRecord', fromVersion: token, 
            search: 
            { deviceSearch: { id: req.body.id_device }, fromDate: req.body.tiempo/*'2020-01-01T00:01:00'/*startDate*/ } })/*, toDate: '2020-01-01T00:01:00' */
                .then(result => {
                    //result.forEach(
                    //console.log(result.length); undefined
                    console.log(result.data.length);
                    console.log(result.toVersion);
                    token = result.toVersion;

                    //for (var m = 0; m < result.data.length; m++) {
                        if(result.data.length>0){
                        coordinates.push({
                            x: result.data[0].longitude,
                            y: result.data[0].latitude, speed: result.data[0].speed,
                            device: result.data[0].device, date: result.data[0].dateTime
                        });
                        a = 5;
                    }
                    a++;

                    //}
                    //revisar el sleep dentro de una funcion
                }).catch(error => console.log('ERROR NO ENCONTRADO VEHICULO', error));
                await sleep(1000);
            }
            res.json({deviceInfo:coordinates});

    }catch(e){  
        console.log('ERROR Device INFO',e);
    }
    };








    //////////////////////////////////
    //metodo de queries a la db suena bien en un metodo diferente y un metodo para actualizarla como la de abajo
    /////////////////////////////////

    //preguntar sobre varias alertas si se puso en amarillo y luego llega otra alerta de que se salio osea rojo...
    //se sobreescribe o quedan guardadas las dos con sus horas??? para hacer el amarillo/rojo???

    //que haremos con el FUERA y el DENTRO????

//Consulta Rules & Exceptions
//cada minuto respuestas
qryCtrlMonitor.QueryExceptions = async (req, res) => {
    //RECIBE id_user y db
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
        // if (result.rows[0].bd == "metrica") {
        //     api = await conexion.updateSessionId();
        // }
        // else {
            api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        //}

        //pedir la lista de datos de la db
        //let text1 = ('SELECT * FROM verRutasyCheckpoints WHERE BD = ($1)');//query de DB = corresponde Y status en programada en progreso
        //quiza se use esta
        let text1 = ('SELECT * FROM verruta_completa WHERE BD=$1');
        let values1 = [req.body.db];
        const { rows } = await pool.query(text1, values1);
        /////

        const idRuleEntrandoStart = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Startpoint'
            },
        })
        //console.log(idRuleEntrandoStart);
        console.log(idRuleEntrandoStart[0].id);

        const idRuleEntrando = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Routes'
            },
        })
        //console.log(idRuleEntrando);
        console.log(idRuleEntrando[0].id);

        const idRuleSaliendo = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Saliendo de MM-Routes'
            },
        })
       // console.log(idRuleSaliendo);
        console.log(idRuleSaliendo[0].id);

        //no esta estipulada
        const idRuleDentro = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Dentro de MM-Routes'
            },
        })
       // console.log(idRuleDentro);
        console.log(idRuleDentro[0].id);


        const idRuleFuera = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Fuera de MM-Routes'
            },
        })
       // console.log(idRuleFuera);
        console.log(idRuleFuera[0].id);


        const idRuleEntrandoEP = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Endpoint'
            },
        })
        //console.log(idRuleEntrandoEP);
        console.log(idRuleEntrandoEP[0].id);



        const idRuleEntrandoCP = await api.call("Get", {
            typeName: "Rule",// filetipe RUle
            search: {
                name: 'Entrando a MM-Checkpoint'
            },
        })
       // console.log(idRuleEntrandoCP);
        console.log(idRuleEntrandoCP[0].id);
        
        
        var Alerts=[];
        //horaActual sacarla en UTC 0, ver otro archivo para referencia
        //ciclo  para comparar cada device y su ubicacion
        var horaActual = new Date();
        console.log(rows.length);
        for (var j = 0; j < rows.length; j++) {


            //por guardar separado ahora conversiones a cada rato

            //hora estimada esta en formato DATE y debe convertirse lo de la db a DATE nuevamente...
////////////////////////////////////se comento para solo enviar la fecha de la alerta//////////////////////////////////////////////////////////////            
            // var fechaS = rows[j].fechallegadaestimada.toISOString();
            // var separar = fechaS.split('T');
            // var fechaa = separar[0].split('-');
            
            // var horaS = rows[j].horallegadaestimada.split(':');

            // var festimadallegarDB= new Date(fechaa[0],fechaa[1],fechaa[2],horaS[0],horaS[1]);//DATE fecha y hora estimada LLEGAR base de datos COMPLETADA

            // //lo mismo para la estimada de la DB
            var fechaSS = rows[j].fechainicioestimada.toISOString();
            var separarr = fechaSS.split('T');
            var fechaaa = separarr[0].split('-');
            
            var horaSS = rows[j].horainicioestimada.split(':');

            var festimadasalirDB= new Date(fechaaa[0],fechaaa[1],fechaaa[2],horaSS[0],horaSS[1]);//DATE fecha y hora estimada INICIO/SALIR base de datos

           // var horaEstimadaActual = new Date(result.data.activeFROM);//formato'2019-09-13T06:45:00Z'
            console.log(festimadasalirDB);//valor original

            //que busque desde una hora antes de la fecha de inicio estimada//
            festimadasalirDB.setMinutes(festimadasalirDB.getMinutes() - 60);//se suman los minutos y la hora
            //es
///////////////////////////////////////////////////////////////////////////////////////////////////

            console.log('antes del primer if');
            if(rows[j].estado == 'Programada'){

                console.log('dentro del primer if');

            //ENTRANDO A ZONA INICIO
            const result= await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    //deviceSearch: { id: rows[j].id_vehiculo }, QUITADO PARA VER RESULTADOS
                    ruleSearch: { id: idRuleEntrandoStart[0].id }, fromDate: '2020-01-01T00:01:00'/*festimadasalirDB*///rows[j].horainicioestimada//fechaInicioRuta//poner fecha de cuando va a arrancar
                }, 
            });
               // .then(result => {
                    //result.forEach(
                    // console.log(result);
                    // console.log(result.data.length);
                    console.log('dentro del primer getfeed');
                    console.log(result.data.length);
                    if(result.data.length>0){
                        
                        console.log(result.data[0].rule);
                        console.log(result.data[0].device);
                        console.log(result.data[0].activeFrom);
                        let datt=result.data[0].activeFrom;//.toISOString();
                            let sep11=datt.split('T');
                            let fri= sep11[0].split('-');
                            let hri=sep11[1].split(':');
                            let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                            let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                            console.log(frealinicio);
                            console.log(hrealinicio);
                        //usando watchdog
                        var idAlert="001";
                        let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                        let values=[rows[j].id_ruta_configurada,idAlert,hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                        await pool.query(text,values);
                        //await pool.query('SELECT * FROM verruta_completa');
                        console.log('paso watchdog entrando startpoint');
//                        watchDogAlertaLite(ide_ruta_configurada VARCHAR,ide_alerta VARCHAR, hora_alerta TIME,fechaAlerta DATE);
                        
                        //////////////////////
                        ///////////ver rutacompleta se actualiza....
                        //////
                        //////////////////////
                        
                        console.log(result.data[0]);

/////////////////////////////////// se comento para usar watchdog/////////////////////////////////
                        // var horaEstimadaActual = new Date(result.data.activeFROM);//formato'2019-09-13T06:45:00Z'
                        // console.log(horaEstimadaActual);//valor original
                        // horaEstimadaActual.setMinutes(horaEstimadaActual.getMinutes() + rows[j].tiempoEstimado);//se suman los minutos y la hora
                        // //estimadaactual es ahora la hora final estimada "real" que resulta del calculo                       
                      

                        // if(festimadallegarDB.getTime()<horaEstimadaActual.getTime()){///estimada de db es menor a estimada calculada es amarillo
                        //     //hacer un push para meter datos de quien entro a la ruta
                        // Alerts.push({ info:'A', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
                            
                        // //hacer un update a la ruta para decir que esta en progreso
                        // //se separa la horaestimadaactual(final calculada) para meterla en la db, 
                        // //la inicial calculada ya esta separada en horas

                    
                        //     let dat=horaEstimadaActual.toISOString();
                        //     let sep1=dat.split('T');
                        //     let frf= sep1[0].split('-');
                        //     let hrf=sep1[1].split(':');
                        //     let frealfin= frf[0]+'-'+frf[1]+'-'+frf[2];//<--------- para guardar en db
                        //     let hrealfin= hrf[0]+':'+hrf[1]+':'+'00';//<------- para guardar en db



                        //         //FALTA SEPARAR LA HORA REAL INICIO pq la recibe separada la db, solo esta la final
                        // //ver si puede salirse del if, se actualizan las dos para los reportes en tiempo real tener lo estimado tmb
                        
                        //     let datt=result.data[0].activeFrom.toISOString();
                        //     let sep11=datt.split('T');
                        //     let fri= sep11[0].split('-');
                        //     let hri=sep11[1].split(':');
                        //     let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                        //     let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db




                        //     pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Amarillo',horaRealinicio='result.data.activeFROM'");
                        //     //poner ademas las alertas con la hora en la base de datos porque queda un historico
                        //     //consultar db y se muestran las alertas
                        // }
                        // else{
                        //     Alerts.push({ info:'V', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
                        //     pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Verde',horaRealinicio='result.data.activeFROM'");
                        // }
//////////////////////////////////////////////////////////////////////////////////////////////////
                        

                    }
             //   }).catch(error => console.log('ENTRANDO ERROR ', error));

            }

            if(rows[j].status == 'En_curso'){


                //por guardar hora y fecha se tienen que sacar las variables para inicio real y llegada real
                //hora estimada esta en formato DATE y debe convertirse lo de la db a DATE nuevamente...
/////////////////////se comentarion 5 lineas para usar watchdog////////////////////////
                // let fechaS = rows[j].fechainicioreal.toISOString();
                // let separar = fechaS.split('T');
                // let fechaa = separar[0].split('-');

                // let horaS = rows[j].horainicioreal.split(':');

                // var finiciorealDB = new Date(fechaa[0], fechaa[1], fechaa[2], horaS[0], horaS[1]);//DATE fecha y hora estimada LLEGAR base de datos
//////////////////////////////////////////////////////////////////////////////////////

            let fechaSS = rows[j].fechainicioestimada.toISOString();
            let separarr = fechaSS.split('T');
            let fechaaa = separarr[0].split('-');

            let horaSS = rows[j].horainicioestimada.split(':');
/////ATENCION VARIABLE REPETIDA///////
            festimadasalirDB= new Date(fechaaa[0],fechaaa[1],fechaaa[2],horaSS[0],horaSS[1]);//DATE fecha y hora estimada INICIO/SALIR base de datos

/////////////////// SE COMENTO PORQUE NO HAY AUN UNA ALERTA PARA ESTO////////////////////////////////////////
            //ENTRANDO A MM ROUTES
//             await api.call('GetFeed', {
//                 typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
//                     deviceSearch: { id: rows[j].id_vehiculo },
//                     ruleSearch: { id: idRuleEntrando[0].id }, fromDate: finiciorealDB//festimadasalirDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
//                 }, resultsLimit: 10
//             })
//                 //.then(result => {
                   
//                      if(result.data.length>0){
//                         console.log(result.data[0].rule);
//                         console.log(result.data[0].device);
//                         //if(result.data.length>0){
                            
    
    //              let datt=result.data[0].activeFrom.toISOString();
//                                 let sep11=datt.split('T');
//                                 let fri= sep11[0].split('-');
//                                 let hri=sep11[1].split(':');
//                                 let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
//                                 let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
//                             //usando watchdog
//                             let text =('watchDogAlertaLite($1,$2,$3,$4)');
//                             let values=[rows[j].id_ruta_configurada, '001',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
//                             pool.query(text,values);
//                             console.log('paso watchdog entrando mm routes');
    
                            
//                             //////////////////////
//                             ///////////ver rutacompleta se actualiza....
//                             //////
//                             //////////////////////
                            
//                             console.log(result.data[0]);
// /////////////////////comentado para usar watchdog//////////////////////////////
//                     //     console.log(result.data[0]);
//                     //     ///////////////////////
//                     //     ////////////////////////
//                     //     //LA LOGICA AQUI CREO NO IRIA TODO EL PARRAFO PUESTO ESTA EL PUNTO DE INICIO
//                     //     //hacer un push para meter datos de quien entro a la ruta quiza esto no para jalar de la db directamente
                        
//                     //     //Alerts.push({ info:'En Curso', id_route:rows[j].id_route, data:result.data[0] });
//                     //     Alerts.push({ info:'En Curso', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
//                     //         //hacer un update a la ruta para decir que esta en progreso
//                     //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso'");
//                     //         //poner ademas las alertas con la hora en la base de datos porque queda un historico
//                     //         //consultar db y se muestran las alertas
// ///////////////////////////////////////////////////////////////////////
//                     }
//               //  }).catch(error => console.log('ENTRANDO ERROR ', error));
//////////////////////////////////////////////////////////////////////////////////////////////

                 //SALIENDO DE MM ROUTES
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleSaliendo[0].id }, fromDate: finiciorealDB//rows[j],horaRealInicio//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
               // .then(result => {
                    //result.forEach(
                    // console.log(result);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    // console.log(result.data[0].device);
                    if(result.data.length>0){
                        console.log(result.data[0].rule);
                        console.log(result.data[0].device);
                        //if(result.data.length>0){
                            
    
                            let datt=result.data[0].activeFrom.toISOString();
                                let sep11=datt.split('T');
                                let fri= sep11[0].split('-');
                                let hri=sep11[1].split(':');
                                let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                                let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                            //usando watchdog
                            let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values=[rows[j].id_ruta_configurada, '005',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                            pool.query(text,values);
                            console.log('paso watchdog saliendo mmroutes');
    
                            
                            //////////////////////
                            ///////////ver rutacompleta se actualiza....
                            //////
                            //////////////////////
                            
                            console.log(result.data[0]);
///////////////////////////////////COMENTADO PARA USAR WATCHDOG/////////////////////////////////////////                        
                        //     console.log(result.data[0]);
                    //     if(rows[j].status=='Amarillo'){//????????????????????????????????????????? preguntar donde consultar status
                    //         //hacer un update a la ruta para decir que la ruta se salio
                    //         //Alerts.push({semaforo:'R/A',data:result.data});
                    //         Alerts.push({ info:'R/A', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
                    //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Rojo/Amarillo',horaenquesucedio='result.data.activeFROM'");
                    //         //poner ademas las alertas con la hora en la base de datos porque queda un historico
                    //         //consultar db y se muestran las alertas
                    //    }
                    //    if(rows[j].status=='Verde'){
                    //         //Alerts.push({semaforo:'V/R',data:result.data});
                    //         Alerts.push({ info:'V/R', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
                    //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Verde/Rojo',horaenquesucedio='result.data.activeFROM'");
                    //         //tiempo pero con salidas, se registra la salida con su hora, fecha y el vehiculo que lo hizo en esa ruta
                    //       //  pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso', semaforo='Verde/Rojo',horaRealinicio='result.data.activeFROM'");
                    //     }
                    }
////////////////////////////////////////////////////////////////////////////////////
               // }).catch(error => console.log('SALIENDO ERROR ', error));

////////////////////////////////AUN NO HAY ALERTA SOBRE ESTANDO DENTRO DE MM ROUTES////////////////////////////////////
            //DENTRO MM ROUTES
            // await api.call('GetFeed', {
            //     typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
            //         deviceSearch: { id: rows[j].id_vehiculo },
            //         ruleSearch: { id: idRuleDentro[0].id }, fromDate: finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
            //     }, resultsLimit: 10
            // })
            //    // .then(result => {
            //         //result.forEach(
            //         console.log(result);
            //         // console.log(result.data.length);
            //         // console.log(result.data[0].rule);
            //         // console.log(result.data[0].device);
            //         if (result.data.length > 0) {
            //             console.log(result.data[0]);
            //             //Alerts.push({info:'En Ruta',data:result.data});
            //             Alerts.push({ info:'En Ruta', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
            //             //hacer un push para meter datos de quien salio a la ruta
            //         }
            //    // }).catch(error => console.log('DENTRO ERROR ', error));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////comentado aun no hay alerta para fuera de mm routes//////////////////////////////
            //FUERA MM ROUTES
            ///PENSAR SI AQUI ES MEJOR EL RESULTADO AL MOMENTO PARA SABER CUANTO TIEMPO HA ESTADO FUERA
//             await api.call('GetFeed', {
//                 typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
//                     deviceSearch: { id: rows[j].id_vehiculo },
//                     ruleSearch: { id: idRuleFuera[0].id }, fromDate: finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
//                 }, resultsLimit: 10
//             })
//                 .then(result => {
//                     //result.forEach(
//                   //  console.log(result);
//                     // console.log(result.data.length);
//                     // console.log(result.data[0].rule);
//                     // console.log(result.data[0].device);
//                     if (result.data.length > 0) {
//                         console.log(result.data[0].rule);
//                         console.log(result.data[0].device);
//                         if(result.data.length>0){
                            
    
//                             let datt=result.data[0].activeFrom.toISOString();
//                                 let sep11=datt.split('T');
//                                 let fri= sep11[0].split('-');
//                                 let hri=sep11[1].split(':');
//                                 let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
//                                 let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
//                             //usando watchdog
//                             let text =('watchDogAlertaLite($1,$2,$3,$4)');
//                             let values=[rows[j].id_ruta_configurada, '004',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
//                             pool.query(text,values);
//                             console.log('paso watchdog entrando startpoint');
    
                            
//                             //////////////////////
//                             ///////////ver rutacompleta se actualiza....
//                             //////
//                             //////////////////////
                            
//                             console.log(result.data[0]);
// ////////////////////////////comentado para watchdog/////////////////////////////
//                         // console.log(result.data[0].rule);
//                         // console.log(result.data[0].device);
//                         // if(result.data.length>0){
                            
    
//                         //     let datt=result.data.activeFROM.toISOString();
//                         //         let sep11=datt.split('T');
//                         //         let fri= sep11[0].split('-');
//                         //         let hri=sep11[1].split(':');
//                         //         let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
//                         //         let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
//                         //     //usando watchdog
//                         //     let text =('watchDogAlertaLite($1,$2,$3,$4)');
//                         //     let values=[rows[j].id_ruta_configurada, '001',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
//                         //     pool.query(text,values);
//                         //     console.log('paso watchdog entrando startpoint');
    
                            
//                         //     //////////////////////
//                         //     ///////////ver rutacompleta se actualiza....
//                         //     //////
//                         //     //////////////////////
                            
//                         //     console.log(result.data[0]);
// ////////////////////////////comentado para watchdog/////////////////////////
//                         // console.log(result.data[0]);
//                         //    // Alerts.push({info:'Fuera de Ruta',data:result.data});
//                         //     Alerts.push({ info:'Fuera de Ruta', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance,
//                         //     duration:result.data[0].duration  });
//                         //     pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='en progreso',info='fuera de ruta',horadelsuceso='result.data.activeFROM'");
//                         //     //poner ademas las alertas con la hora en la base de datos porque queda un historico
//                         //     //consultar db y se muestran las alertas
// ////////////////////////////////////////////////////////////////////                        
//                         }
//                 }).catch(error => console.log('FUERA ERROR ', error));

////////////////////////////////////////////////////////////////////////////////////////////////////////
            //ENTRANDO CHECKPOINT
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleEntrandoCP[0].id }, fromDate: finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
               // .then(result => {
                    //result.forEach(
                    //console.log(result);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    // console.log(result.data[0].device);
                    if (result.data.length > 0) {
                        console.log(result.data[0].rule);
                        console.log(result.data[0].device);
                      //  if(result.data.length>0){
                            
    
                        let datt=result.data[0].activeFrom.toISOString();
                                let sep11=datt.split('T');
                                let fri= sep11[0].split('-');
                                let hri=sep11[1].split(':');
                                let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                                let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                            //usando watchdog
                            let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values=[rows[j].id_ruta_configurada, '007',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                            pool.query(text,values);
                            console.log('paso watchdog pasando checkpoint');
    
                            
                            //////////////////////
                            ///////////ver rutacompleta se actualiza....
                            //////
                            //////////////////////
                            
                            console.log(result.data[0]);
//////////////////////////comentado para uso de watchdog////////////////////////////                        
                    //     
                    }
               // }).catch(error => console.log('ENTRANDO CHECKPOINT ERROR ', error));


            //ENTRANDO ENDPOINT
            await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },
                    ruleSearch: { id: idRuleEntrandoEP[0].id }, fromDate: finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
               // .then(result => {
                    //result.forEach(
                    // console.log(result);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    //console.log(result.data[0].device);
                   
                    if(result.data.length>0){
                        
                        console.log(result.data[0].rule);
                        console.log(result.data[0].device);

                        let datt=result.data[0].activeFrom.toISOString();
                            let sep11=datt.split('T');
                            let fri= sep11[0].split('-');
                            let hri=sep11[1].split(':');
                            let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                            let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                        //usando watchdog
                        let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                        let values=[rows[j].id_ruta_configurada, '001',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                        pool.query(text,values);
                        console.log('paso watchdog entrando startpoint');

                        
                        //////////////////////
                        ///////////ver rutacompleta se actualiza....
                        //////
                        //////////////////////
                        
                        console.log(result.data[0]);
/////////////////////////////////comentado para usar watchdog///////////////////                    
                    // if (result.data.length > 0) {
                    //     console.log(result.data[0]);
                    //     Alerts.push({ info:'Fuera de Ruta', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance});
                    //     if ((festimadallegarDB.getTime() <= horaActual.getTime()) && rows[j].semaforo != 'A') {//averiguar donde sacar el estatus del color
                    //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='verde',horaRealLlegada='result.data.activeFROM'");
                    //     }
                    //     if ((festimadallegarDB.getTime() <= horaActual.getTime()) && rows[j].semaforo == 'A') {
                    //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='rojo/verde',horaRealLlegada='result.data.activeFROM'");
                    //     }
                    //     if ((festimadallegarDBl.getTime() > horaActual.getTime()) && rows[j].semaforo == 'A') {
                    //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='rojo/amarillo',horaRealLlegada='result.data.activeFROM'");
                    //     }
                    //     if ((festimadallegarDB.getTime() > horaActual.getTime()) && rows[j].semaforo != 'A') {
                    //         pool.query("UPDATE FROM WHERE id_ruta=rows[j].id SET status='finalizada',semaforo='rojo',horaRealLlegada='result.data.activeFROM'");
                    //     }
                }
              //  }).catch(error => console.log('ENTRANDO ENDPOINT ERROR ', error));
            }
                console.log(j);
                
        }
        text = ('SELECT * FROM verruta_completa WHERE BD=$1');
            //completas
        values = [req.body.db];
            let alerts = await pool.query(text, values);
            res.json({ alertas:alerts.rows });
    }
    catch (e) {
        console.log('ERROR QUERY EXCEPTIONS', e);
    }
};


module.exports = qryCtrlMonitor;