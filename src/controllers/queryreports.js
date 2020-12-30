const qryCtrlReports = {};

//const conexion = require('../conexion');?????????????????????????? todo sobre nuestra db
const { pool } = require('../database');

qryCtrlReports.QueryRoute = async (req, res) => {

    try {
        console.log(req.body);
        let text = 'SELECT imprimirReporte($1,$2,$3,$4,$5)';//drivers es correo, vehiculos el id
        let values = [req.body.type, req.body.dateFrom, req.body.dateTo, req.body.drivers, req.body.devices];
        await pool.query(text, values);
        var query;
        console.log('antes de los ifs');
        if (req.body.type == "Programada") {
            text = 'SELECT * FROM verReporteProgramada WHERE bd=$1';//drivers es correo, vehiculos el id
            values = [req.body.db];
            query = await pool.query(text, values);
        }
        if (req.body.type == "En_Curso") {
            text = ('SELECT * FROM verReporteEn_Curso WHERE bd=$1');
            values = [req.body.db];
            query = await pool.query(text, values);
        }
        if (req.body.type == "Finalizada") {
            text='SELECT * FROM verReporteFinalizada WHERE bd=$1';
            values = [req.body.db];
            query = await pool.query(text, values);
        }
        if (req.body.type == "General") {
            text='SELECT * FROM verReporteGeneral WHERE bd=$1';
            values = [req.body.db];
            query = await pool.query(text, values);
        }
        else {
            console.log('REPORT TYPE', req.body.type);
        }
        //console.log('REPORT TYPE',req.body.type);
        console.log(query.rows);
        res.json({ Reporte: query.rows });
    }
        catch(e){
            console.log('ERROR REPORTS QUERY ROUTE',e);
        }
};





module.exports = qryCtrlReports;