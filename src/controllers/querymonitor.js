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
         //let text=('SELECT * FROM ruta_checkpoint WHERE id_ruta_catalogo=$1');//id_ruta_catalogo???
         let text=('SELECT * FROM Ruta_Configurada_Checkpoint WHERE id_ruta_configurada=$1');//id_ruta_catalogo???
         let values=[checkpoints.id_routep];//cambio
         const {rows} = await pool.query(text,values);
         console.log(rows.length);
         console.log(rows[0]);


        //  let text2 = "DELETE FROM Ruta_Configurada_Checkpoint WHERE id_ruta_configurada=$1";
        // let values2=[checkpoints.id_routep];
        // await pool.query(text2,values2);
        // console.log('borro');
         if(rows.length==0){
             res.json({status:'Not Found!'});
         }
         else {
            // let text='SetRuta_Configurada_Checkpoint(ide_ruta_configurada varchar(30),ide_checkpoint varchar(30),
                                                    // _fecha DATE,_hora TIME,ide_usuario varchar(60) default null);'
            ///nueva funcion donde no se borran
            for (let y = 0; y < checkpoints.checkpoints.length; y++) {
             let text = 'SELECT SetRuta_Configurada_Checkpoint($1,$2,$3,$4,$5)';
             ///////rows y ???? checar
             let values = [checkpoints.id_routep, checkpoints.checkpoints[y].id_punto, checkpoints.checkpoints[y].fecha, checkpoints.checkpoints[y].hora, checkpoints.id_user];
             await pool.query(text, values);
            //////////////////////////////////////
            }
            //  for (let y = 0; y < checkpoints.checkpoints.length; y++) {
            //     //let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
            //     //let text2 = 'INSERT INTO Ruta_Checkpoint VALUES ($1,$2,$3,$4,$5)';
            //     let text2 = 'INSERT INTO Ruta_Configurada_Checkpoint VALUES ($1,$2,$3,$4,$5)';
            //     // let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';    
            //     //pedir hora y fecha ya que lo solicita la db para ingresar manualmente funcionando ver formatos fecha y hora al pedir
            //     let values2 = [checkpoints.id_routep, checkpoints.checkpoints[y].id_punto, checkpoints.checkpoints[y].name_punto,checkpoints.checkpoints[y].fecha,checkpoints.checkpoints[y].hora];
            //     await pool.query(text2, values2);
            // }
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
    
    //escuchando un poco de tiempo  antes, cuando se consulta sale el id de la zona especifica
    //mm routes que entre en cualquiera del mapa
    //preguntar tiempo de consulta de los vehiculos puede ser en tiempo real ya que si habra datos.
    //PEDIR A DB que guarde el estado del semaforo para poner IF antes de entrar a una verificacion como "PUNTO INICIO"
    //EN DB guardar si ya termino para que quede omitida en la consulta de la linea 120 donde se consulta db y el status y filtrar
    
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);

        console.log(result.rows[0]);
        console.log(result.rows);
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
            console.log('fecha inicio estimada prueba');
            console.log(rows[j].fechainicioestimada);
            var fechaSS = rows[j].fechainicioestimada.toISOString();
            console.log('fecha ISO');
            console.log(fechaSS);
            var separarr = fechaSS.split('T');
            console.log(separarr);
            var fechaaa = separarr[0].split('-');
            console.log(fechaaa[0],fechaaa[1],fechaaa[2]);
            
            /////////////restar 1 al mes para poder aplicar new DATE/////////////////
            var fechnewDATE=fechaaa[1]-1;

            var horaSS = rows[j].horainicioestimada.split(':');
            console.log(horaSS);
            console.log(horaSS[0]);
            var festimadasalirDB= new Date(fechaaa[0],fechnewDATE/*fechaaa[1]*/,fechaaa[2],horaSS[0],horaSS[1]);//DATE fecha y hora estimada INICIO/SALIR base de datos
            
           // var horaEstimadaActual = new Date(result.data.activeFROM);//formato'2019-09-13T06:45:00Z'
            console.log(festimadasalirDB);//valor original

            //que busque desde una hora antes de la fecha de inicio estimada//
            festimadasalirDB.setMinutes(festimadasalirDB.getMinutes() - 60);//se suman los minutos y la hora
            //es
            console.log(festimadasalirDB);
///////////////////////////////////////////////////////////////////////////////////////////////////

            console.log('antes del primer if');
            if(rows[j].estado == 'Programada'){

                console.log('dentro del primer if');

            //ENTRANDO A ZONA INICIO
            const result= await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id: rows[j].id_vehiculo },// QUITADO PARA VER RESULTADOS
                    ruleSearch: { id: idRuleEntrandoStart[0].id }, fromDate:/* req.body.testeofecha*//*'2020-01-28T17:01:00'*/festimadasalirDB///rows[j].horainicioestimada//fechaInicioRuta//poner fecha de cuando va a arrancar
                }, 
            });
               // .then(result => {
                    //result.forEach(
                    // console.log(result);
                    // console.log(result.data.length);
                    console.log('dentro del primer getfeed');
                    console.log(result.data.length);
                    console.log(result.data[0]);
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
                        //frealinicio='2021-12-12'; PARA PROBAR QUE NO ARRANQUE EN EL MOMENTO
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

///////////////////////////////////////////////////////////////////////////////ANOTACIOOOOOOOOOOOOOOOOOOOOOOOOOOOONNNNNNNNNNNNNNNN/////////////////////
                        // let text1 = ('SELECT * FROM verruta_completa WHERE BD=$1');
                        // let values1 = [req.body.db];
                        //   { rows } = await pool.query(text1, values1);
/////////////////////////////////// se comento para usar watchdog/////////////////////////////////
                        // var horaEstimadaActual = new Date(result.data.activeFROM);//formato'2019-09-13T06:45:00Z'
                        // console.log(horaEstimadaActual);//valor original
                        // horaEstimadaActual.setMinutes(horaEstimadaActual.getMinutes() + rows[j].tiempoEstimado);//se suman los minutos y la hora
              //////////////////////////////////////////////////////////////////////////////////////////////////
                        

                    }
             //   }).catch(error => console.log('ENTRANDO ERROR ', error));

            }

///////////////////////////////////////EL ESTADO ES EL ORIGINAL PORQUE NO SE REALIZO QUERY///////////////////////////////////

            console.log(rows[j].estado);
            if(rows[j].estado == 'En_Curso'){

                console.log('dentro de En_curso');
                //por guardar hora y fecha se tienen que sacar las variables para inicio real y llegada real
                //hora estimada esta en formato DATE y debe convertirse lo de la db a DATE nuevamente...
/////////////////////se comentarion 5 lineas para usar watchdog////////////////////////
           
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////1. REVISAR EL ENDPOINT
///////////////////2. CHECKPOINT (variable contadora, como el for anterior)
///////////////////3. BANDERA para saber si esta dentro o fuera de la ruta
///////////////////4. si la ruta esta dentro buscar cuando se salio, si se salio cuando volvio a entrar


                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // var finiciorealDB = new Date(fechaa[0], fechaa[1], fechaa[2], horaS[0], horaS[1]);//DATE fecha y hora estimada LLEGAR base de datos
//////////////////////////////////////////////////////////////////////////////////////

            let fechaSS = rows[j].fechainicioestimada.toISOString();
            let separarr = fechaSS.split('T');
            let fechaaa = separarr[0].split('-');

            let horaSS = rows[j].horainicioestimada.split(':');
/////ATENCION VARIABLE REPETIDA///////



//////////////////////restar 1 al mes//////////////////////////////
                let fff= fechaaa[1]-1;
            festimadasalirDB= new Date(fechaaa[0],fff/*fechaaa[1]-1*/,fechaaa[2],horaSS[0],horaSS[1]);//DATE fecha y hora estimada INICIO/SALIR base de datos

                
// await api.call('GetFeed', { typeName: 'ExceptionEvent', /*fromVersion: token, */search:{ deviceSearch:{id:'b1EA'},
// ruleSearch:{id:idRuleEntrando[0].id},fromDate:'2020-12-12T00:01:00'},resultsLimit:10})
           // ENTRANDO A MM ROUTES

                console.log(rows[j].id_vehiculo);
                console.log(idRuleEntrando[0].id);
                console.log(req.body.testeofecha);

 //ENTRANDO ENDPOINT

 var EP=false;
 var toFecha;
 const resultEP = await api.call('GetFeed', {
    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
        deviceSearch: { id:/*'b1EA'}, */rows[j].id_vehiculo }, //agregado vehiculo fake para resultados
        ruleSearch: { id: idRuleEntrandoEP[0].id }, fromDate: festimadasalirDB//req.body.testeofecha//'2020-01-01T00:01:00'//finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
    }, resultsLimit: 10
});
   // .then(result => {
        //result.forEach(
        // console.log(result);
        // console.log(result.data.length);
        // console.log(result.data[0].rule);
        //console.log(result.data[0].device);
       
        if(resultEP.data.length>0){
            EP=true;/////////agregado para fecha final
            console.log(resultEP.data[0].rule);
            console.log(resultEP.data[0].device);
            console.log(resultEP.data[0]);
            console.log(resultEP.data[0].activeFrom);

            let datt=resultEP.data[0].activeFrom;//.toISOString();  //<-----------error no es una funcion????????????
                let sep11=datt.split('T');
                console.log('afrom');
                console.log(sep11);
                let fri= sep11[0].split('-');
                let hri=sep11[1].split(':');
                let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
            //usando watchdog
            let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
            let values=[rows[j].id_ruta_configurada, '003',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
            pool.query(text,values);
            console.log('paso watchdog entrando ENDtpoint');
///////////////////agregado para fecha////////////////
            if(EP==false){
                toFecha=horaActual;
            }
            if(EP==true){
                toFecha=resultEP.data[0].activeFrom;
            }
            //////////////////////////////////////////////////////////
            //////////////////////
            ///////////ver rutacompleta se actualiza....
            //////
            //////////////////////
            
            console.log(resultEP.data[0]);
/////////////////////////////////comentado para usar watchdog///////////////////                    
      
    }







///entrando mm routes¡¡¡¡¡¡¡¡¡¡???????????////////////////////

            const result = await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id:/*'b1EA'*/ rows[j].id_vehiculo },//AGREGADO id vehiculo para dar resultados
                    ruleSearch: { id: idRuleEntrando[0].id }, fromDate: festimadasalirDB,toDate:toFecha//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            })
                //.then(result => {
                    console.log('dentro de 1er apicall');
                     if(result.data.length>0){
                        console.log(result.data[0].rule);
                        console.log(result.data[0].device);
                        //if(result.data.length>0){
                            
                            for(let k=0;k<result.data.length;k++){
                                let datt=result.data[k].activeFrom;//.toISOString();
                                let sep11=datt.split('T');
                                let fri= sep11[0].split('-');
                                let hri=sep11[1].split(':');
                                let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                                let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                            //usando watchdog
                            //dentro de un for

                                let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values=[rows[j].id_ruta_configurada, '006',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                            await pool.query(text,values);
                            }
                            
                            console.log('paso watchdog entrando mm routes');
                        ////
                            
                            //////////////////////
                            ///////////ver rutacompleta se actualiza....
                            //////
                            //////////////////////
                            
                            console.log(result.data[0]);
/////////////////////comentado para usar watchdog//////////////////////////////
                 
///////////////////////////////////////////////////////////////////////
                    }
              //  }).catch(error => console.log('ENTRANDO ERROR ', error));
//////////////////////////////////////////////////////////////////////////////////////////////

                 //SALIENDO DE MM ROUTES
           const result1= await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id:/*'b1EA'},*/ rows[j].id_vehiculo }, //agregado vehiculo fake para resultados
                    ruleSearch: { id: idRuleSaliendo[0].id }, fromDate:festimadasalirDB,toDate:toFecha// req.body.testeofecha//'2020-01-01T00:01:00' //finiciorealDB//rows[j],horaRealInicio//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
               // .then(result => {
                    //result.forEach(
                    // console.log(result);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    // console.log(result.data[0].device);
                    if(result1.data.length>0){
                        console.log(result1.data[0].rule);
                        console.log(result1.data[0].device);
                        //if(result.data.length>0){
                            
                            for(let k=0;k<result1.data.length;k++){
                            let datt=result1.data[k].activeFrom;//.toISOString();
                                let sep11=datt.split('T');
                                let fri= sep11[0].split('-');
                                let hri=sep11[1].split(':');
                                let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                                let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                            //usando watchdog
                            let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values=[rows[j].id_ruta_configurada, '005',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                            await pool.query(text,values);
                            }
                            console.log('paso watchdog saliendo mmroutes');
    
                            
                            //////////////////////
                            ///////////ver rutacompleta se actualiza....
                            //////
                            //////////////////////
                            
                            console.log(result1.data[0]);
///////////////////////////////////COMENTADO PARA USAR WATCHDOG/////////////////////////////////////////                        
               
                    }
////////////////////////////////////////////////////////////////////////////////////
               // }).catch(error => console.log('SALIENDO ERROR ', error));

////////////////////////////////AUN NO HAY ALERTA SOBRE ESTANDO DENTRO DE MM ROUTES////////////////////////////////////
           // DENTRO MM ROUTES
            const resIn = await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id:/*'b1EA'}, */rows[j].id_vehiculo },// agregado vehiculo fake para resultados
                    ruleSearch: { id: idRuleDentro[0].id }, fromDate: festimadasalirDB, toDate:toFecha//req.body.testeofecha//'2020-01-01T00:01:00'//finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
               // .then(result => {
                    //result.forEach(
                    //console.log(resultIn);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    // console.log(result.data[0].device);
                    if (resIn.data.length > 0) {
                       // console.log(result.data[0]);
                        //Alerts.push({info:'En Ruta',data:result.data});
                        //Alerts.push({ info:'En Ruta', id_route:rows[j].id_ruta_configurada, vehiculo:rows[j].device, hora:result.data[0].activeFrom, distancia:result.data[0].distance });
                        //hacer un push para meter datos de quien salio a la ruta
                        let text =('SELECT setDentro($1,$2,$3)');
                            let values=[rows[j].id_ruta_configurada, resIn.data[0].duration,resIn.data[0].distance];//con el id de alerta ya saca la db las horas y fechas
                            await pool.query(text,values);
                            console.log('paso watchdog dentro MMROUTES');
                    }

            // FUERA MM ROUTES
           const resOut = await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: {id:/*'b1EA'},*/ rows[j].id_vehiculo },// agregado vehiculo fake para resultados
                    ruleSearch: { id: idRuleFuera[0].id }, fromDate: festimadasalirDB,toDate:toFecha//req.body.testeofecha//'2020-01-01T00:01:00'//finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
                //.then(result => {
                    //result.forEach(
                  //  console.log(result);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    // console.log(result.data[0].device);
                    
                        if(resOut.data.length>0){
                            
                            //usando watchdog
                            let text =('SELECT setFuera($1,$2,$3)');
                            let values=[rows[j].id_ruta_configurada,resOut.data[0].duration,resOut.data[0].distance];//con el id de alerta ya saca la db las horas y fechas
                            await pool.query(text,values);
                            console.log('paso watchdog fuera MMROUTES');
    
                            
                            //////////////////////
                            ///////////ver rutacompleta se actualiza....
                            //////
                            //////////////////////
                            console.log('fuera');
                            console.log(resOut.data[0]);
////////////////////////////comentado para watchdog/////////////////////////////
                 
    
                 
                            
                        //     console.log(result.data[0]);
////////////////////////////comentado para watchdog/////////////////////////
                       
////////////////////////////////////////////////////////////////////                        
                        }
             //   }).catch(error => console.log('FUERA ERROR ', error));

////////////////////////////////////////////////////////////////////////////////////////////////////////
            //ENTRANDO CHECKPOINT
            const resultCP = await api.call('GetFeed', {
                typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                    deviceSearch: { id:/*'b1EA'},*/rows[j].id_vehiculo },// agregado vehiculo fake para resultados
                    ruleSearch: { id: idRuleEntrandoCP[0].id }, fromDate: festimadasalirDB,toDate:toFecha//req.body.testeofecha//'2020-01-01T00:01:00'//finiciorealDB//'2020-01-01T00:01:00'//poner fecha de cuando va a arrancar
                }, resultsLimit: 10
            });
               // .then(result => {
                    //result.forEach(
                    //console.log(result);
                    // console.log(result.data.length);
                    // console.log(result.data[0].rule);
                    // console.log(result.data[0].device);
                    if (resultCP.data.length > 0) {
                        // console.log(resultCP.data[0].rule);
                        // console.log(resultCP.data[0].device);
                      //  if(result.data.length>0){
                          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                          for(let h=0;h<resultCP.data.length;h++)
                          {
                            var uCP = resultCP.data.length - 1;
                            var coordinates = [];
                            const resultDI = await api.call('Get', {
                                typeName: 'DeviceStatusInfo', search:
                                    { deviceSearch: { id: /*'b36'*/ rows[j].id_vehiculo }, fromDate: resultCP.data[h].activeFrom
                                    /*'2020-12-22T16:04:59.990Z'/*'2020-01-01T00:01:00'/*startDate*/ }
                            });/*, toDate: '2020-01-01T00:01:00' */
                               // .then(result => {
                                    //result.forEach(
                                    if (resultDI.length > 0) {
                                        console.log('datosDSI');
                                        console.log(resultDI[0]);
                                        coordinates.push({
                                            x: resultDI[0].longitude,
                                            y: resultDI[0].latitude
                                        });
                                        // );
                                        let datt=resultCP.data[h].activeFrom;//.toISOString();
                                        let sep11=datt.split('T');
                                        let fri= sep11[0].split('-');
                                        let hri=sep11[1].split(':');
                                        let fechaCP= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                                        let horaCP= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                                        console.log('coordenadas cp');
                                        console.log(coordinates);
    
                                      const resultGA = await api.call('GetAddresses', { coordinates: coordinates });
                                          //  .then(result => {
                                                console.log(resultGA.length);
                                                console.log(resultGA);
                                                console.log(resultGA[0].street);
    //                                            console.log(resultGA[0].zones);
                                                //console.log(resultGA[0].zones[0].id);
                                               if(resultGA[0].zones[0].id != undefined){////////////////agregado del if
    
                                                
    
    
                                                ////////////////////SEPARAR FECHA DE ALERTA////////////////////////
    
    
                                                /////////////////////////////////////////////
                                                for (let k = 0; k < rows[j].json_build_object.ruta.length; k++) {
                                                    console.log('ingresando para meter id zone');
                                                    console.log(rows[j].json_build_object.ruta[k].id_checkpoint);
                                                        console.log(resultGA[0].zones[0].id);
                                                    if (rows[j].json_build_object.ruta[k].id_checkpoint == resultGA[0].zones[0].id) {
                                                       
                                                        
                                                            let text='SELECT SetRuta_Configurada_Checkpoint($1,$2,$3,$4,$5)';
                                                            let values = [rows[j].id_ruta_configurada, resultGA[0].zones[0].id, fechaCP,horaCP,req.body.id_user];
                                                            pool.query(text, values);
                                                        }
                                                    }
                                                }/////////////////////////////<------------------agregado del if
                                            }
                                            }
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////ORIGINAL/////////////////////////////////////////////////////////////////////////                        
//                         var uCP = resultCP.data.length - 1;
//                         var coordinates = [];
//                         const resultDI = await api.call('Get', {
//                             typeName: 'DeviceStatusInfo', search:
//                                 { deviceSearch: { id: /*'b36'*/ rows[j].id_vehiculo }, fromDate: resultCP.data[uCP].activeFrom
//                                 /*'2020-12-22T16:04:59.990Z'/*'2020-01-01T00:01:00'/*startDate*/ }
//                         });/*, toDate: '2020-01-01T00:01:00' */
//                            // .then(result => {
//                                 //result.forEach(
//                                 if (resultDI.length > 0) {
//                                     console.log('datosDSI');
//                                     console.log(resultDI[0]);
//                                     coordinates.push({
//                                         x: resultDI[0].longitude,
//                                         y: resultDI[0].latitude
//                                     });
//                                     // );
//                                     let datt=resultCP.data[uCP].activeFrom;//.toISOString();
//                                     let sep11=datt.split('T');
//                                     let fri= sep11[0].split('-');
//                                     let hri=sep11[1].split(':');
//                                     let fechaCP= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
//                                     let horaCP= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
//                                     console.log('coordenadas cp');
//                                     console.log(coordinates);

//                                   const resultGA = await api.call('GetAddresses', { coordinates: /*[{ x: -102.8429946899414, y: 23.161401748657227 }]*/coordinates });
//                                       //  .then(result => {
//                                             console.log(resultGA.length);
//                                             console.log(resultGA);
//                                             console.log(resultGA[0].street);
// //                                            console.log(resultGA[0].zones);
//                                             //console.log(resultGA[0].zones[0].id);
//                                            if(resultGA[0].zones[0].id != undefined){////////////////agregado del if

                                            


//                                             ////////////////////SEPARAR FECHA DE ALERTA////////////////////////


//                                             /////////////////////////////////////////////
//                                             for (let k = 0; k < rows[j].json_build_object.ruta.length; k++) {
//                                                 console.log('ingresando para meter id zone');
//                                                 console.log(rows[j].json_build_object.ruta[k].id_checkpoint);
//                                                     console.log(resultGA[0].zones[0].id);
//                                                 if (rows[j].json_build_object.ruta[k].id_checkpoint == resultGA[0].zones[0].id) {
                                                   
//                                                     /////////////////////update checkpoint cuando entro a el////////////////////////////
//                                                     // let text='SetRuta_Configurada_Checkpoint(ide_ruta_configurada varchar(30),ide_checkpoint varchar(30),
//                                                     // _fecha DATE,_hora TIME,ide_usuario varchar(60) default null);'
// /*ERROR AQUI ERROR EN EL $5 fue 53                  */let text='SELECT SetRuta_Configurada_Checkpoint($1,$2,$3,$4,$5)';
// //-------------------------------------------------------->let text = 'UPDATE Ruta_Checkpoint WHERE id_checkpoint=$1 SET (hrealinicio)';
//                                                         let values = [rows[j].id_ruta_configurada, resultGA[0].zones[0].id, fechaCP,horaCP,req.body.id_user];
//                                                         pool.query(text, values);
//                                                     }
//                                                 }
//                                             }/////////////////////////////<------------------agregado del if
//////////////////////////////////////////////////////////////////////////ORIGINAL/////////////////////////////////////////////////////////////////////////
                                        //});
                    
                        //    }).catch(error => console.log(error));

                        console.log('getaddresses');
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



                            
                        for(let k=0;k<resultCP.data.length;k++){
                            let datt=resultCP.data[k].activeFrom;//.toISOString();
                                let sep11=datt.split('T');
                                let fri= sep11[0].split('-');
                                let hri=sep11[1].split(':');
                                let frealinicio= fri[0]+'-'+fri[1]+'-'+fri[2];//<--------- para guardar en db
                                let hrealinicio= hri[0]+':'+hri[1]+':'+'00';//<------- para guardar en db
                            //usando watchdog
                            let text =('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values=[rows[j].id_ruta_configurada, '007',hrealinicio,frealinicio];//con el id de alerta ya saca la db las horas y fechas
                            await pool.query(text,values);
                        }
                            console.log('paso watchdog pasando checkpoint');
    
                            
                            //////////////////////
                            ///////////ver rutacompleta se actualiza....
                            //////
                            //////////////////////
                            
                            console.log(resultCP.data[0]);
//////////////////////////comentado para uso de watchdog////////////////////////////                        
                    //     
                    
                //}//<-------------agregado del if data > 0<----------------------ponerlo si no se usa el for
               // }).catch(error => console.log('ENTRANDO CHECKPOINT ERROR ', error));


           
              //  }).catch(error => console.log('ENTRANDO ENDPOINT ERROR ', error));
            }
        }//agregado es el del if en curso
                console.log(j);
                
        }
    
        // text = ('SELECT * FROM verruta_completa WHERE BD=$1');
        //     //completas
        // values = [req.body.db];
        //     let alerts = await pool.query(text, values);
        //     res.json({ alertas:alerts.rows });
        console.log('??? alertas??????');
        var completeRoutenAlerts=[];
            //let ntext = ('SELECT * FROM verruta_completa WHERE BD=($1) as t1 inner join verAlertas as t2 On t1.id_ruta_configurada = t2.id_ruta_configurada');4
//            let ntext ='Select * from verRuta_completa as t1 inner join Veralertas as t2 on t1.id_ruta_configurada = t2.id_ruta_configurada Where BD = $1';
            let ntext ='SELECT * FROM verRuta_completa WHERE BD = $1';          
            //completas
             let nvalues = [req.body.db];
            let ruta = await pool.query(ntext, nvalues);
            
            let mtext='SELECT * FROM verAlertas WHERE BD=$1';
            let alerts = await pool.query(mtext,nvalues);


            for(let o=0;o<ruta.rows.length;o++){
                completeRoutenAlerts.push({ruta:ruta.rows[o],alerts:alerts.rows[o]});
            }
            console.log('??? alertas');


            res.json({ ruta_completa_con_alertas:completeRoutenAlerts });

        //select * from verRuta_Completa as t1
        //inner join verAlertas as t2 On t1.id_ruta_configurada = t2.id_ruta_configurada;
 }
    catch (e) {
        console.log('ERROR QUERY EXCEPTIONS', e);
    }
};


qryCtrlMonitor.QueryAlerts = async (req, res) => {
    try{
        console.log(req.body.db);
        let text='SELECT * FROM verRuta_Alertas WHERE BD=$1';
            //completas
        let values = [req.body.db];
        let alerts = await pool.query(text, values);
        console.log('alertas');
            res.json({ alertas:alerts.rows });
    }catch(e){
        console.log(e);
        res.json(e);
    }
}


//crear metodo solo para alertas

module.exports = qryCtrlMonitor;