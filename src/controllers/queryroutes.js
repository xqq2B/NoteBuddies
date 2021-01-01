const qryCtrlRoutes = {};
const conexion = require('../conexion');
const { pool } = require('../database');

qryCtrlRoutes.QueryRoute = async (req, res) => {
    try {
        var api;
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);

        const zones = await api.call("Get", {
            typeName: "ZoneType",
            search: {
                "name": 'MM R Routes'
            },
        });
        const zonesRoutes = await api.call("Get", {
            typeName: "Zone",
            search: {
                zoneTypes: [{ id: zones[0].id }]
            }
        });
        var Rutas = [];

        for (let i = 0; i < zonesRoutes.length; i++) {
            if (zonesRoutes[i].groups[0] != null) {

                Rutas.push({ id: zonesRoutes[i].id, name: zonesRoutes[i].name });
            }
            else {
                console.log('registro incompleto', i);
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
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);

        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);

        const zones = await api.call("Get", {
            typeName: "ZoneType",
            search: {
                name: 'MM R Checkpoint'
            },
        });

        const zonesCheckPoints = await api.call("Get", {
            typeName: "Zone",
            search: {
                zoneTypes: [{ id: zones[0].id }]
            }
        });
        var Checkpoints = [];
        for (var i = 0; i < zonesCheckPoints.length; i++) {
            if (zonesCheckPoints[i].groups[0] != null) {
                Checkpoints.push({ id: zonesCheckPoints[i].id, name: zonesCheckPoints[i].name });
            }
        }
        res.json({ Checkpoints });
    }
    catch (e) {
        console.log('ERROR QUERY CHECKPOINTS RUTAS' + e);
    }
};


qryCtrlRoutes.QueryEndpoints = async (req, res) => {
    try {
        var api;
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        const zones = await api.call("Get", {
            typeName: "ZoneType",
            search: {
                name: 'MM R Endpoint'
            },
        });

        const zonesEndPoints = await api.call("Get", {
            typeName: "Zone",
            search: {
                zoneTypes: [{ id: zones[0].id }]
            }
        });
        var Endpoints = [];
        for (var i = 0; i < zonesEndPoints.length; i++) {
            if (zonesEndPoints[i].groups[0] != null) {
                Endpoints.push({ id: zonesEndPoints[i].id, name: zonesEndPoints[i].name });
            }
        }
        res.json({ Endpoints });
    }
    catch (e) {
        console.log('ERROR QUERY ENDPOINTS RUTAS' + e);
    }
};


qryCtrlRoutes.QueryStartpoints = async (req, res) => {
    try {
        var api;
        let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        const zones = await api.call("Get", {
            typeName: "ZoneType",
            search: {
                name: 'MM R Startpoint'
            },
        });
        const zonesStartPoints = await api.call("Get", {
            typeName: "Zone",
            search: {
                zoneTypes: [{ id: zones[0].id }]
            }
        });
        var Startpoints = [];
        for (var i = 0; i < zonesStartPoints.length; i++) {
            if (zonesStartPoints[i].groups[0] != null) {
                Startpoints.push({ id: zonesStartPoints[i].id, name: zonesStartPoints[i].name });
            }
        }
        res.json({ Startpoints });
    }
    catch (e) {
        console.log('ERROR QUERY STARTPOINTS RUTAS' + e);
    }
};

qryCtrlRoutes.QueryDriver = async (req, res) => {
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        var driver = [];

        for (j = 0; j < result.rows[0].json_build_object.grupo.length; j++) {
            await api.call('Get', { typeName: 'User', search: { groups: [{ id: result.rows[0].json_build_object.grupo[j] }], isDriver: true } })
                .then(results => {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].name != null) {
                            driver.push({ name: results[i].name });
                        }
                    }
                })
                .catch(error => {
                    console.log('ERROR DRIVERS APICALL', error);
                });
        }
        res.json({ driver });
    }
    catch (e) {
        console.log('ERROR QUERY DRIVER RUTAS' + e);
    }
};


qryCtrlRoutes.QueryTrailer = async (req, res) => {
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        var trailer = [];
        var rep = false;
        for (j = 0; j < result.rows[0].json_build_object.grupo.length; j++) {
            await api.call('Get', { typeName: 'Trailer', search: { groups: [{ id: result.rows[0].json_build_object.grupo[j] }] }, })
                .then(results => {
                    console.log('dentro trailers');
                    console.log(results.length);
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].name != null) {
                            for (k = 0; k < trailer.length; k++) {
                                if (trailer[k].id == results[i].id) {
                                    rep = true;
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
        res.json({ trailer });
    }
    catch (e) {
        console.log('ERROR QUERY TRAILER RUTAS' + e);
    }
};

qryCtrlRoutes.QueryDevice = async (req, res) => {
    try {
        var api;
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
        var device = [];
        var rep = false;
        for (j = 0; j < result.rows[0].json_build_object.grupo.length; j++) {
            await api.call('Get', { typeName: 'Device', search: { groups: [{ id: result.rows[0].json_build_object.grupo[j] }] }, })
                .then(results => {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].name != null) {
                            for (k = 0; k < device.length; k++) {
                                if (device[k].id == results[i].id) {
                                    rep = true;
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
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const text = 'SELECT * FROM Ruta_catalogo WHERE id_ruta_catalogo= $1';
    const value = [result];
    const { rows } = await pool.query(text, value);
    if (rows.length > 0) {
        makeIdRoute();
    }
    else {
        return result;
    }
}


qryCtrlRoutes.CreateSpecificRoute = async (req, res) => {
    try {
        var ruta = req.body;
        const { rows } = await pool.query('SELECT * FROM verruta_completa');
        let text = ('SELECT * FROM ruta_catalogo WHERE id_ruta_catalogo=$1');
        let values = [ruta.id_ruta];
        const result = await pool.query(text, values);
        var fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
        var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
        var response = null;
        if (rows.length == 0) {
            fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            var fechaS = fsalida.toISOString();
            var separar = fechaS.split('T');
            var fechaa = separar[0].split('-');
            var horass = separar[1].split(':');
            var fsalidaa = fechaa[0] + "-" + fechaa[1] + "-" + fechaa[2];
            var hsalidaa = horass[0] + ":" + horass[1] + ":" + "00";
            let m = result.rows[0].tiempoEstimado;
            fsali.setMinutes(fsali.getMinutes() + result.rows[0].tiempoestimado);
            var fechaSS = fsali.toISOString();
            var separarr = fechaSS.split('T');
            var fechaaa = separarr[0].split('-');
            var horasss = separarr[1].split(':');
            var fllegadaa = fechaaa[0] + "-" + fechaaa[1] + "-" + fechaaa[2];
            var hllegadaa = horasss[0] + ":" + horasss[1] + ":" + "00";
            let semaforo = 'Programada';
            let idRuta = await makeIdRoute();
            let text = 'SELECT createRuta_Configurada($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
            let values = [ruta.id_ruta, idRuta, ruta.conductor, ruta.id_vehicle, ruta.name_vehicle, ruta.shipment, fsalidaa, hsalidaa, fllegadaa, hllegadaa, semaforo, ruta.id_user];
            await pool.query(text, values);

            for (let n = 0; n < ruta.trailers.length; n++) {
                text = 'SELECT setTrailer($1,$2,$3)';
                values = [idRuta, ruta.trailers[n].id_trailer, ruta.trailers[n].name_trailer];
                await pool.query(text, values);
            }

            res.json({ status: 'ok' });
        }
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                response = false;
                repeatTrailer = false;

                for (let n = 0; n < ruta.trailers.length; n++) {
                    for (let x = 0; x < rows[i].json_build_array.length; x++) {
                        if (ruta.trailers[n].id_trailer == rows[i].json_build_array[0][x].id_trailer)
                            repeatTrailer = true;
                    }
                }


                if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (repeatTrailer == true)) {

                    var dDate = new Date(rows[i].fechainicioestimada);
                    var aDate = new Date(rows[i].fechallegadaestimada);
                    var mesS = parseInt(ruta.fechaIni.mes);

                    fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                    let m = result.rows[0].tiempoEstimado;
                    fsali.setMinutes(fsali.getMinutes() + result.rows[0].tiempoestimado);
                    let fechaSS = fsali.toISOString();
                    let separarr = fechaSS.split('T');
                    let fechaaa = separarr[0].split('-');
                    let horasss = separarr[1].split(':');
                    let fllegadaa = fechaaa[0] + "-" + fechaaa[1] + "-" + fechaaa[2];
                    let hllegadaa = horasss[0] + ":" + horasss[1] + ":" + "00";
                    let hllegada = new Date(0, 0, 0, horasss[0], horasss[1]);
                    let fllegada = new Date(fechaaa[0], fechaaa[1], fechaaa[2]);

                    fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
                    if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
                        var dates = rows[i].horainicioestimada.split(':');
                        var datel = rows[i].horallegadaestimada.split(':');
                        var dHour = new Date(0, 0, 0, dates[0], dates[1]);
                        var aHour = new Date(0, 0, 0, datel[0], datel[1]);

                        if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
                            ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
                            response = true;
                            res.json({ status: 'Horarios Incompatibles' });
                        }
                    }
                }
            }
        }
        if (response == false) {
            let idRuta = await makeIdRoute();
            fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            let fechaS = fsalida.toISOString();
            let separar = fechaS.split('T');
            let fechaa = separar[0].split('-');
            let horass = separar[1].split(':');
            let fsalidaa = fechaa[0] + "-" + fechaa[1] + "-" + fechaa[2];
            let hsalidaa = horass[0] + ":" + horass[1] + ":" + "00";
            let m = result.rows[0].tiempoEstimado;
            fsali.setMinutes(fsali.getMinutes() + result.rows[0].tiempoestimado);
            let fechaSS = fsali.toISOString();
            let separarr = fechaSS.split('T');
            let fechaaa = separarr[0].split('-');
            let horasss = separarr[1].split(':');
            let fllegadaa = fechaaa[0] + "-" + fechaaa[1] + "-" + fechaaa[2];
            let hllegadaa = horasss[0] + ":" + horasss[1] + ":" + "00";
            let semaforo = 'Programada';

            let text = 'SELECT createRuta_Configurada($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
            let values = [ruta.id_ruta, idRuta, ruta.conductor, ruta.id_vehicle, ruta.name_vehicle, ruta.shipment, fsalidaa, hsalidaa, fllegadaa, hllegadaa, semaforo, ruta.id_user];
            await pool.query(text, values);

            for (let n = 0; n < ruta.trailers.length; n++) {
                text = 'SELECT setTrailer($1,$2,$3)';
                values = [idRuta, ruta.trailers[n].id_trailer, ruta.trailers[n].name_trailer];
                await pool.query(text, values);
            }
            res.json({ status: 'ok' });
        }
    }
    catch (e) {
        console.log('ERROR CREANDO RUTAS' + e);
    }
};


qryCtrlRoutes.EditSpecificRoute = async (req, res) => {
    try {
        var ruta = req.body;
        console.log('editando ruta');
        console.log('ed ruta');
        let text = ('SELECT * FROM verruta_completa WHERE id_ruta_configurada!=$1');
        let values = [ruta.id_ruta_configurada];
        var response = false;
        var hsalida = new Date(0, 0, 0, ruta.horaIni.hora, ruta.horaIni.minutos);
        const { rows } = await pool.query(text, values);
        let textt = ('SELECT * FROM ruta_catalogo WHERE id_ruta_catalogo=$1');
        let valuess = [ruta.id_ruta_catalogo];
        const result = await pool.query(textt, valuess);
        repeatTrailer = false;
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {

                for (let n = 0; n < ruta.trailers.length; n++) {

                    for (let x = 0; x < rows[i].json_build_array.length; x++) {

                        if (ruta.trailers[n].id_trailer == rows[i].json_build_array[0][x].id_trailer)
                            repeatTrailer = true;
                    }
                }

                if ((ruta.conductor == rows[i].conductor) || (ruta.name_vehicle == rows[i].vehiculo) || (repeatTrailer == true)) {

                    var dDate = new Date(rows[i].fechainicioestimada);
                    var aDate = new Date(rows[i].fechallegadaestimada);
                    var mesS = parseInt(ruta.fechaIni.mes);
                    fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
                    let m = result.rows[0].tiempoEstimado;
                    fsali.setMinutes(fsali.getMinutes() + result.rows[0].tiempoestimado);
                    let fechaSS = fsali.toISOString();
                    let separarr = fechaSS.split('T');
                    let fechaaa = separarr[0].split('-');
                    let horasss = separarr[1].split(':');
                    let fllegadaa = fechaaa[0] + "-" + fechaaa[1] + "-" + fechaaa[2];
                    let hllegadaa = horasss[0] + ":" + horasss[1] + ":" + "00";
                    let hllegada = new Date(0, 0, 0, horasss[0], horasss[1]);
                    let fllegada = new Date(fechaaa[0], fechaaa[1], fechaaa[2]);
                    fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia);
                    if ((dDate.getTime() == fsalida.getTime()) || (aDate.getTime() == fllegada.getTime())) {
                        console.log('entre fechas');
                        var dates = rows[i].horainicioestimada.split(':');
                        var datel = rows[i].horallegadaestimada.split(':');
                        var dHour = new Date(0, 0, 0, dates[0], dates[1]);
                        var aHour = new Date(0, 0, 0, datel[0], datel[1]);
                        if (((hsalida.getTime() >= dHour.getTime()) && (hsalida.getTime() <= aHour.getTime())) ||
                            ((hllegada.getTime() >= dHour.getTime()) && (hllegada.getTime() <= aHour.getTime()))) {
                            response = true;
                            res.json({ status: 'Horarios Incompatibles' });
                        }
                    }
                }
            }
        }
        if (response == false) {
            hsalida = ruta.horaIni.hora + ":" + ruta.horaIni.minutos + ":" + "00";
            let fsalida = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            fsali = new Date(ruta.fechaIni.anio, ruta.fechaIni.mes, ruta.fechaIni.dia, ruta.horaIni.hora, ruta.horaIni.minutos);
            let fechaS = fsalida.toISOString();
            let separar = fechaS.split('T');
            let fechaa = separar[0].split('-');
            let horass = separar[1].split(':');
            let fsalidaa = fechaa[0] + "-" + fechaa[1] + "-" + fechaa[2];
            let hsalidaa = horass[0] + ":" + horass[1] + ":" + "00";
            let m = result.rows[0].tiempoEstimado;
            fsali.setMinutes(fsali.getMinutes() + result.rows[0].tiempoestimado);
            let fechaSS = fsali.toISOString();
            let separarr = fechaSS.split('T');
            let fechaaa = separarr[0].split('-');
            let horasss = separarr[1].split(':');
            let fllegadaa = fechaaa[0] + "-" + fechaaa[1] + "-" + fechaaa[2];
            let hllegadaa = horasss[0] + ":" + horasss[1] + ":" + "00";
            let text = 'SELECT updateRuta_configurada($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
            let values = [ruta.id_ruta_configurada, ruta.id_ruta_catalogo, ruta.conductor, ruta.id_vehicle,
            ruta.name_vehicle, ruta.shipment, fsalidaa, hsalidaa, fllegadaa, hllegadaa, req.body.id_user];
            await pool.query(text, values);


            text = 'DELETE FROM ruta_trailer where id_ruta_configurada = $1';
            values = [ruta.id_ruta_configurada];
            await pool.query(text, values);

            for (let n = 0; n < ruta.trailers.length; n++) {
                text = 'SELECT setTrailer($1,$2,$3)';
                values = [ruta.id_ruta_configurada, ruta.trailers[n].id_trailer, ruta.trailers[n].name_trailer];
                await pool.query(text, values);
            }
        }
        res.json({ status: 'ok' });
    }
    catch (e) {
        console.log('ERROR EDITANDO RUTAS' + e);
    }
};


qryCtrlRoutes.DeleteSpecificRoute = async (req, res) => {
    try {
        let text = ('SELECT deleteRuta_configurada($1,$2)');
        let values = [req.body.id_route, req.body.id_user];
        await pool.query(text, values);
        res.json({ status: 'ok' });
    }
    catch (e) {
        console.log('ERROR BORRANDO RUTAS CONFIGURADAS' + e);
    }
};


qryCtrlRoutes.CreateRoute = async (req, res) => {
    try {
        var Ruta = req.body;
        let idRuta = await makeIdRoute();
        text = "SELECT createRuta_catalogo($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        values = [idRuta, Ruta.id_route, Ruta.name_catalogo, Ruta.name_route, Ruta.id_start, Ruta.name_start, Ruta.id_end, Ruta.name_end, Ruta.tEstimado, Ruta.db];
        await pool.query(text, values);

        for (let y = 0; y < Ruta.checkpoints.length; y++) {
            let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
            let values2 = [idRuta, Ruta.checkpoints[y].id_punto, Ruta.checkpoints[y].name_punto];
            await pool.query(text2, values2);
        }

        let text0 = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values0 = [Ruta.id_user];//cambiado de req.body.id_user
        const result0 = await pool.query(text0, values0);

        for (let k = 0; k < result0.rows[0].json_build_object.grupo.length; k++) {
            let text3 = 'SELECT createUsuario_Ruta($1,$2,$3)';//preguntar ultimo valor 
            let values3 = [Ruta.id_user, idRuta, result0.rows[0].json_build_object.grupo[k].id_grupo];
            await pool.query(text3, values3);
        }
        res.json('ok!');
    } catch (e) {
        console.log(e);
    }
};


qryCtrlRoutes.EditRoute = async (req, res) => {
    try {
        var Ruta = req.body;
        text = "SELECT updateRuta_catalogo($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        values = [Ruta.id_ruta_catalogo, Ruta.id_route, Ruta.name_catalogo, Ruta.name_route, Ruta.id_start, Ruta.name_start, Ruta.id_end, Ruta.name_end, Ruta.tEstimado, Ruta.db];
        await pool.query(text, values);


        let text2 = "DELETE FROM Ruta_Checkpoint WHERE id_ruta_catalogo=$1";
        let values2 = [Ruta.id_ruta_catalogo];
        await pool.query(text2, values2);
        const { rows } = await pool.query('SELECT * FROM Ruta_Checkpoint');
        for (let y = 0; y < Ruta.checkpoints.length; y++) {
            let text2 = 'SELECT createRuta_Checkpoint($1,$2,$3)';
            let values2 = [Ruta.id_ruta_catalogo, Ruta.checkpoints[y].id_punto, Ruta.checkpoints[y].name_punto];
            await pool.query(text2, values2);
        }
        res.json('ok!');
    } catch (e) {
        console.log(e);
    }
};

qryCtrlRoutes.QueryCatalogRoute = async (req, res) => {
    try {
        let text = ('SELECT * FROM verRuta_Catalogo WHERE BD = $1');
        let values = [req.body.db];
        const { rows } = await pool.query(text, values);
        res.json(rows);
    } catch (e) {
        console.log('ERROR QUERY CATALOGO', e);
    }
};




qryCtrlRoutes.QueryCatalogRouteSpecific = async (req, res) => {
    try {
        let text = ('SELECT * FROM verRuta_Catalogo WHERE BD = $1');
        let values = [req.body.db];
        const { rows } = await pool.query(text, values);
        var rutas_catalogo = []
        for (let i = 0; i < rows.length; i++) {
            rutas_catalogo.push({ id: rows[i].id_ruta_catalogo, name: rows[i].nombreruta });
        }
        res.json(rutas_catalogo);
    } catch (e) {
        console.log('ERROR QUERY CATALOGO ESPECIFICA', e);
    }
};



qryCtrlRoutes.QueryGroup = async (req, res) => {
    try {
        let text = 'SELECT * FROM vistaObtenerUsuario WHERE id_usuario = $1';
        let values = [req.body.id_user];
        const result = await pool.query(text, values);
        var groups = [];
        for (var i = 0; i < result.rows[0].json_build_object.grupo.length; i++) {
            groups.push({
                id: result.rows[0].json_build_object.grupo[i].id_grupo,
                name: result.rows[0].json_build_object.grupo[i].nombreGrupo
            });
        }
        res.json({ groups });
    } catch (e) {
        console.log('ERROR QUERY GROUPS', e);
    }
};


qryCtrlRoutes.DeleteRoute = async (req, res) => {
    try {
        console.log(req.params);
        let text = ('SELECT deleteRuta_catalogo($1)');
        let values = [req.params.id_route];
        await pool.query(text, values);
        res.json({ status: 'ok' });
    }
    catch (e) {
        console.log('ERROR BORRANDO RUTAS CATALOGO' + e);
    }
};

qryCtrlRoutes.QueryAll = async (req, res) => {
    try {
        if (req.body.queryConfig == true) {
            let text = ('SELECT * FROM verruta_completa WHERE BD=$1');
            let values = [req.body.db];
            const { rows } = await pool.query(text, values);
            res.json({ rows });
        }
        else {
            let text = 'select * from vistaObtenerUsuario WHERE id_usuario = $1';
            let values = [req.body.id_user];
            const result = await pool.query(text, values);
            var api = await conexion.sessionOtherDb(result.rows[0].correo, result.rows[0].bd, result.rows[0].sessionid, result.rows[0].path);
            let texts = ('SELECT * FROM verruta_completa WHERE BD=$1');
            let valuess = [req.body.db];
            const { rows } = await pool.query(texts, valuess);
            var completeRoute = [];
            for (var j = 0; j < rows.length; j++) {
                const zonesEndPoints = await api.call("Get", {
                    typeName: "Zone",
                    search: {
                        id: rows[j].id_endpoint
                    }
                });
                var EndPoints = [];
                for (i = 0; i < zonesEndPoints.length; i++) {
                    EndPoints.push({ points: zonesEndPoints[i].points });
                }
                const zonesStartPoints = await api.call("Get", {
                    typeName: "Zone",
                    search: {
                        id: rows[j].id_startpoint
                    }
                });

                var StartPoints = [];
                for (i = 0; i < zonesStartPoints.length; i++) {
                    StartPoints.push({ points: zonesStartPoints[i].points });
                }
                const zonesRoutePoints = await api.call("Get", {
                    typeName: "Zone",
                    search: {
                        id: rows[j].id_rutageotab
                    }
                });
                var RoutePoints = [];
                for (i = 0; i < zonesRoutePoints.length; i++) {
                    RoutePoints.push({ points: zonesRoutePoints[i].points });
                }
                var CheckPoints = [];
                for (var k = 0; k < rows[j].json_build_object.ruta.length; k++) {
                    const zonesCheckPoints = await api.call("Get", {
                        typeName: "Zone",
                        search: {
                            id: rows[j].json_build_object.ruta[k].id_checkpoint
                        }
                    });

                    CheckPoints.push({
                        id_checkpoint: rows[j].json_build_object.ruta[k].id_checkpoint, nombrecheckpoint: rows[j].json_build_object.ruta[k].nombrecheckpoint,
                        points: zonesCheckPoints[0].points, fecha: rows[j].json_build_object.ruta[k].fecha, hora: rows[j].json_build_object.ruta[k].hora
                    });

                }
                completeRoute.push({
                    id_ruta: rows[j].id_ruta_configurada, id_rutageotab: rows[j].id_rutageotab, nombreruta: rows[j].nombreruta, nombrerutageotab: rows[j].nombrerutageotab, RouteCoor: RoutePoints,
                    conductor: rows[j].conductor, id_vehiculo: rows[j].id_vehiculo, vehiculo: rows[j].vehiculo, semaforo: rows[j].semaforo, trailer: rows[j].json_build_array,
                    shipment: rows[j].shipment, fecha_salida: rows[j].fechainicioestimada, hora_salida: rows[j].horainicioestimada,
                    fecha_llegada: rows[j].fechallegadaestimada, hora_llegada: rows[j].horallegadaestimada, estado: rows[j].estado, bd: rows[j].bd,
                    id_startpoint: rows[j].id_startpoint, startpoint: rows[j].startpoint, StartCoor: StartPoints,
                    id_endpoint: rows[j].id_endpoint, endpoint: rows[j].endpoint, EndCoor: EndPoints, CheckPoints: CheckPoints
                });
            }
            res.json({ completeRoute });
        }
    }
    catch (e) {
        console.log('ERROR CONSULTANDO RUTAS CONFIGURADAS' + e);
    }
};



module.exports = qryCtrlRoutes;
