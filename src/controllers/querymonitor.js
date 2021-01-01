const qryCtrlMonitor = {};
const conexion = require('../conexion');
const { pool } = require('../database');


const util = require('util');
const sleep = util.promisify(setTimeout);

qryCtrlMonitor.EditCheckPoint = async (req, res) => {

    try {
        var checkpoints = req.body;
        let text = ('SELECT * FROM Ruta_Configurada_Checkpoint WHERE id_ruta_configurada=$1');
        let values = [checkpoints.id_routep];
        const { rows } = await pool.query(text, values);
        if (rows.length == 0) {
            res.json({ status: 'Not Found!' });
        }
        else {
            for (let y = 0; y < checkpoints.checkpoints.length; y++) {
                let text = 'SELECT setRuta_Configurada_CheckpointManual($1,$2,$3,$4,$5)';
                let values = [checkpoints.id_routep, checkpoints.checkpoints[y].id_punto, checkpoints.checkpoints[y].fecha, checkpoints.checkpoints[y].hora, checkpoints.id_user];
                await pool.query(text, values);
            }
            res.json({ status: 'ok' });
        }
    }
    catch (e) {
        console.log('ERROR EDITANDO CP Monitor', e);
    }
};

qryCtrlMonitor.QueryDevice = async (req, res) => {

    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        var coordinates = [];
        var ff = new Date();
        console.log(ff);
        var startDate = ff.toISOString();
        console.log(startDate);
        var a = 0;
        var objFecha = new Date();
        console.log(objFecha.getUTCDate() + "/" + objFecha.getUTCMonth() + "/" + objFecha.getUTCFullYear());
        console.log(objFecha.getUTCHours() + ":" + objFecha.getUTCMinutes() + ":" + objFecha.getUTCSeconds());
        var token = null;
        while (a < 4) {
            await api.call('GetFeed', {
                typeName: 'LogRecord', fromVersion: token,
                search:
                    { deviceSearch: { id: req.body.id_device }, fromDate: req.body.tiempo/*'2020-01-01T00:01:00'/*startDate*/ }
            })
                .then(result => {
                    console.log(result.data.length);
                    token = result.toVersion;
                    if (result.data.length > 0) {
                        coordinates.push({
                            x: result.data[0].longitude,
                            y: result.data[0].latitude, speed: result.data[0].speed,
                            device: result.data[0].device, date: result.data[0].dateTime
                        });
                        a = 5;
                    }
                    a++;
                }).catch(error => console.log('ERROR NO ENCONTRADO VEHICULO', error));
            await sleep(1000);
        }
        res.json({ deviceInfo: coordinates });

    } catch (e) {
        console.log('ERROR Device INFO', e);
    }
};

qryCtrlMonitor.QueryExceptions = async (req, res) => {
    //id_user y db
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);

        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);

        let text1 = ('SELECT * FROM verruta_completa WHERE BD=$1');
        let values1 = [req.body.db];
        const { rows } = await pool.query(text1, values1);

        const idRuleEntrandoStart = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Startpoint'
            },
        });
        console.log(idRuleEntrandoStart[0].id);

        const idRuleEntrando = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Routes'
            },
        });
        console.log(idRuleEntrando[0].id);

        const idRuleSaliendo = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Saliendo de MM-Routes'
            },
        });
        console.log(idRuleSaliendo[0].id);

        const idRuleDentro = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Dentro de MM-Routes'
            },
        });
        console.log(idRuleDentro[0].id);

        const idRuleFuera = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Fuera de MM-Routes'
            },
        });
        console.log(idRuleFuera[0].id);


        const idRuleEntrandoEP = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Endpoint'
            },
        });
        console.log(idRuleEntrandoEP[0].id);



        const idRuleEntrandoCP = await api.call("Get", {
            typeName: "Rule",
            search: {
                name: 'Entrando a MM-Checkpoint'
            },
        })
        console.log(idRuleEntrandoCP[0].id);


        var Alerts = [];
        var horaActual = new Date();
        console.log(rows.length);
        for (var j = 0; j < rows.length; j++) {

            console.log('fecha inicio estimada prueba');
            console.log(rows[j].fechainicioestimada);
            var fechaSS = rows[j].fechainicioestimada.toISOString();
            console.log('fecha ISO');
            console.log(fechaSS);
            var separarr = fechaSS.split('T');
            console.log(separarr);
            var fechaaa = separarr[0].split('-');
            console.log(fechaaa[0], fechaaa[1], fechaaa[2]);

            var fechnewDATE = fechaaa[1] - 1;

            var horaSS = rows[j].horainicioestimada.split(':');
            console.log(horaSS);
            console.log(horaSS[0]);
            var festimadasalirDB = new Date(fechaaa[0], fechnewDATE/*fechaaa[1]*/, fechaaa[2], horaSS[0], horaSS[1]);

            console.log(festimadasalirDB);

            festimadasalirDB.setMinutes(festimadasalirDB.getMinutes() - 60);
            console.log(festimadasalirDB);
            ///////////////////////////////////////////////////////////////////////////////////////////////////

            console.log('antes del primer if');
            if (rows[j].estado == 'Programada') {

                console.log('dentro del primer if');

                //ENTRANDO A ZONA INICIO
                const result = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id: rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleEntrandoStart[0].id }, fromDate:/*'2020-01-28T17:01:00'*/festimadasalirDB
                    },
                });
                
                console.log('dentro del primer getfeed');
                console.log(result.data.length);
                console.log(result.data[0]);
                if (result.data.length > 0) {

                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);
                    console.log(result.data[0].activeFrom);
                    let datt = result.data[0].activeFrom;//.toISOString();
                    let sep11 = datt.split('T');
                    let fri = sep11[0].split('-');
                    let hri = sep11[1].split(':');
                    let frealinicio = fri[0] + '-' + fri[1] + '-' + fri[2];
                    let hrealinicio = hri[0] + ':' + hri[1] + ':' + '00';
                    console.log(frealinicio);
                    console.log(hrealinicio);
                    //usando watchdog
                    var idAlert = "001";
                    let text = ('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                    let values = [rows[j].id_ruta_configurada, idAlert, hrealinicio, frealinicio];
                    await pool.query(text, values);
                    console.log('paso watchdog entrando startpoint');

                    console.log(result.data[0]);


                }
            }

            ///////////////////////////////////////EL ESTADO ES EL ORIGINAL PORQUE NO SE REALIZO QUERY///////////////////////////////////

            console.log(rows[j].estado);
            if (rows[j].estado == 'En_Curso') {

                console.log('dentro de En_curso');
                let fechaSS = rows[j].fechainicioestimada.toISOString();
                let separarr = fechaSS.split('T');
                let fechaaa = separarr[0].split('-');
                let horaSS = rows[j].horainicioestimada.split(':');
                let fff = fechaaa[1] - 1;
                festimadasalirDB = new Date(fechaaa[0], fff/*fechaaa[1]-1*/, fechaaa[2], horaSS[0], horaSS[1]);
                console.log('fechaestimadasalirDB');
                console.log(festimadasalirDB);
                console.log(rows[j].id_vehiculo);
                console.log(idRuleEntrando[0].id);
                console.log(req.body.testeofecha);

                //ENTRANDO ENDPOINT

                var EP = false;
                var toFecha;
                const resultEP = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id: rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleEntrandoEP[0].id }, fromDate: festimadasalirDB
                    },// resultsLimit: 10
                });

                if (resultEP.data.length > 0) {
                    EP = true;
                    console.log(resultEP.data[0].rule);
                    console.log(resultEP.data[0].device);
                    console.log(resultEP.data[0]);
                    console.log(resultEP.data[0].activeFrom);

                    let datt = resultEP.data[0].activeFrom;//.toISOString(); 
                    let sep11 = datt.split('T');
                    console.log('afrom');
                    console.log(sep11);
                    let fri = sep11[0].split('-');
                    let hri = sep11[1].split(':');
                    let frealinicio = fri[0] + '-' + fri[1] + '-' + fri[2];
                    let hrealinicio = hri[0] + ':' + hri[1] + ':' + '00';
                    //usando watchdog
                    let text = ('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                    let values = [rows[j].id_ruta_configurada, '003', hrealinicio, frealinicio];
                    pool.query(text, values);
                    console.log('paso watchdog entrando ENDtpoint');
                    console.log(resultEP.data[0].activeFrom);
                    ///////////////////agregado para fecha////////////////
                    if (EP == false) {
                        console.log('hora actual');
                        toFecha = horaActual;
                    }
                    if (EP == true) {
                        console.log('fecha de activeFROM');
                        toFecha = resultEP.data[0].activeFrom;
                    }
                    console.log(resultEP.data[0]);
                    console.log(toFecha);
                }


                ///entrando mm routes¡¡¡¡¡¡¡¡¡¡???????????////////////////////

                const result = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id:/*'b1EA'*/ rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleEntrando[0].id }, fromDate: festimadasalirDB, toDate: toFecha
                    }, resultsLimit: 100
                })
                //.then(result => {
                console.log('entrando MMROutes');
                console.log(result.data.length);
                if (result.data.length > 0) {
                    console.log(result.data[0].rule);
                    console.log(result.data[0].device);

                    for (let k = 0; k < result.data.length; k++) {
                        var activeF = new Date(result.data[k].activeFrom).getTime();
                        var tFecha = new Date(toFecha).getTime();
                        console.log('ffffechas');
                        console.log(tFecha);
                        console.log(activeF);
                        if (activeF < tFecha) {

                            console.log('entro menor que entrando mmroutes');
                            let datt = result.data[k].activeFrom;
                            let sep11 = datt.split('T');
                            let fri = sep11[0].split('-');
                            let hri = sep11[1].split(':');
                            let frealinicio = fri[0] + '-' + fri[1] + '-' + fri[2];
                            let hrealinicio = hri[0] + ':' + hri[1] + ':' + '00';

                            let text = ('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values = [rows[j].id_ruta_configurada, '006', hrealinicio, frealinicio];
                            await pool.query(text, values);
                        }
                    }

                    console.log('paso watchdog entrando mm routes');
                    console.log(result.data[0]);
                }

                //SALIENDO DE MM ROUTES
                const result1 = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id: rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleSaliendo[0].id }, fromDate: festimadasalirDB, toDate: toFecha
                    }, resultsLimit: 100
                });
                // .then(result => {

                console.log('saliendo MMROutes');
                console.log(result1.data.length);

                if (result1.data.length > 0) {
                    console.log(result1.data[0].rule);
                    console.log(result1.data[0].device);


                    for (let k = 0; k < result1.data.length; k++) {
                        let activeF = new Date(result1.data[k].activeFrom).getTime();
                        let tFecha = new Date(toFecha).getTime();

                        if (activeF < tFecha) {
                            let datt = result1.data[k].activeFrom;
                            let sep11 = datt.split('T');
                            let fri = sep11[0].split('-');
                            let hri = sep11[1].split(':');
                            let frealinicio = fri[0] + '-' + fri[1] + '-' + fri[2];
                            let hrealinicio = hri[0] + ':' + hri[1] + ':' + '00';

                            let text = ('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values = [rows[j].id_ruta_configurada, '005', hrealinicio, frealinicio];
                            await pool.query(text, values);
                        }
                    }
                    console.log('paso watchdog saliendo mmroutes');

                    console.log(result1.data[0]);

                }
                // DENTRO MM ROUTES
                const resIn = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id: rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleDentro[0].id }, fromDate: festimadasalirDB, toDate: toFecha
                    }, resultsLimit: 100
                });
                if (resIn.data.length > 0) {

                    let text = ('SELECT setDentro($1,$2,$3)');
                    let values = [rows[j].id_ruta_configurada, resIn.data[0].duration, resIn.data[0].distance];
                    await pool.query(text, values);
                    console.log('paso watchdog dentro MMROUTES');
                }

                // FUERA MM ROUTES
                const resOut = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id: rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleFuera[0].id }, fromDate: festimadasalirDB, toDate: toFecha////cambio ultimaversion
                    }, resultsLimit: 10
                });
                if (resOut.data.length > 0) {

                    let text = ('SELECT setFuera($1,$2,$3)');
                    let values = [rows[j].id_ruta_configurada, resOut.data[0].duration, resOut.data[0].distance];
                    await pool.query(text, values);
                    console.log('paso watchdog fuera MMROUTES');

                    console.log('fuera');
                    console.log(resOut.data[0]);
                }

                //ENTRANDO CHECKPOINT
                const resultCP = await api.call('GetFeed', {
                    typeName: 'ExceptionEvent', /*fromVersion: token, */search: {
                        deviceSearch: { id: rows[j].id_vehiculo },
                        ruleSearch: { id: idRuleEntrandoCP[0].id }, fromDate: festimadasalirDB
                    }, resultsLimit: 100
                });

                console.log(resultCP.data.length);
                console.log(resultCP);
                if (resultCP.data.length > 0) {

                    for (let h = 0; h < resultCP.data.length; h++) {
                        let activeF = new Date(resultCP.data[h].activeFrom).getTime();
                        let tFecha = new Date(toFecha).getTime();
                        
                        if (activeF < tFecha) {
                            var coordinates = [];
                            const resultDI = await api.call('Get', {
                                typeName: 'DeviceStatusInfo', search:
                                    { deviceSearch: { id: rows[j].id_vehiculo }, fromDate: resultCP.data[h].activeFrom }
                            });
                            console.log('probando cp');
                            console.log(resultCP.data[h].activeFrom);
                            if (resultDI.length > 0) {
                                console.log('datosDSI');
                                console.log(resultDI[0]);
                                console.log(resultDI);
                                coordinates.push({
                                    x: resultDI[h].longitude,
                                    y: resultDI[h].latitude
                                });
                                let datt = resultCP.data[h].activeFrom;//.toISOString();
                                let sep11 = datt.split('T');
                                let fri = sep11[0].split('-');
                                let hri = sep11[1].split(':');
                                let fechaCP = fri[0] + '-' + fri[1] + '-' + fri[2];
                                let horaCP = hri[0] + ':' + hri[1] + ':' + '00';
                                console.log('coordenadas cp');
                                console.log(coordinates);

                                const resultGA = await api.call('GetAddresses', { coordinates: coordinates });
                                //  .then(result => {
                                console.log(resultGA.length);
                                console.log(resultGA);
                                console.log(resultGA[0].street);
                                if (resultGA[0].zones[0].id != undefined) {
                                    for (let k = 0; k < rows[j].json_build_object.ruta.length; k++) {
                                        console.log('ingresando para meter id zone');
                                        console.log(rows[j].json_build_object.ruta[k].id_checkpoint);
                                        console.log(resultGA[0].zones[0].id);
                                        if (rows[j].json_build_object.ruta[k].id_checkpoint == resultGA[0].zones[0].id) {
                                            let text = 'SELECT SetRuta_Configurada_Checkpoint($1,$2,$3,$4,$5)';
                                            let values = [rows[j].id_ruta_configurada, resultGA[0].zones[0].id, fechaCP, horaCP, req.body.id_user];
                                            await pool.query(text, values);//added awat latest version
                                        }
                                    }
                                }
                            }
                        }
                    }


                    console.log('getaddresses');
                    for (let k = 0; k < resultCP.data.length; k++) {
                        let activeF = new Date(resultCP.data[k].activeFrom).getTime();
                        let tFecha = new Date(toFecha).getTime();

                        if (activeF < tFecha) {
                            let datt = resultCP.data[k].activeFrom;//.toISOString();
                            let sep11 = datt.split('T');
                            let fri = sep11[0].split('-');
                            let hri = sep11[1].split(':');
                            let frealinicio = fri[0] + '-' + fri[1] + '-' + fri[2];//<--------- para guardar en db
                            let hrealinicio = hri[0] + ':' + hri[1] + ':' + '00';//<------- para guardar en db
                            //usando watchdog
                            let text = ('SELECT watchDogAlertaLite($1,$2,$3,$4)');
                            let values = [rows[j].id_ruta_configurada, '007', hrealinicio, frealinicio];
                            await pool.query(text, values);
                        }
                    }
                    console.log('paso watchdog pasando checkpoint');

                    console.log(resultCP.data[0]);
                }
            }
            console.log(j);

        }


        console.log('??? alertas??????');
        var completeRoutenAlerts = [];

        let ntext = 'SELECT * FROM verRuta_completa WHERE BD = $1';
        let nvalues = [req.body.db];
        let ruta = await pool.query(ntext, nvalues);
        let mtext = 'SELECT * FROM verAlertas WHERE BD=$1';
        let alerts = await pool.query(mtext, nvalues);


        for (let o = 0; o < ruta.rows.length; o++) {
            completeRoutenAlerts.push({ ruta: ruta.rows[o], alerts: alerts.rows[o] });
        }
        console.log('??? alertas');


        res.json({ ruta_completa_con_alertas: completeRoutenAlerts });
    }
    catch (e) {
        console.log('ERROR QUERY EXCEPTIONS', e);
    }
};


qryCtrlMonitor.QueryAlerts = async (req, res) => {
    try {
        let text = 'SELECT * FROM verRuta_Alertas WHERE BD=$1';
        let values = [req.body.db];
        let alerts = await pool.query(text, values);
        console.log('alertas query');
        res.json({ alertas: alerts.rows });
    } catch (e) {
        console.log(e);
        res.json(e);
    }
}


module.exports = qryCtrlMonitor;