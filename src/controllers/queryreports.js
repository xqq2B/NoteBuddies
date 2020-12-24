const qryCtrlReports = {};

//const conexion = require('../conexion');?????????????????????????? todo sobre nuestra db
const { pool } = require('../database');

qryCtrlReports.QueryRoute = async (req, res) => {

    try {
        console.log(req.body);
        let text ='SELECT imprimirReporte($1,$2,$3,$3)';//drivers es correo, vehiculos el id
        let values=[req.body.type,req.body.dateFrom,req.body.dateTo,req.body.drivers,req.body.devices];
        await pool.query(text,values);
        var query;
        if(req.body.type=="Programada"){
        query= await pool.query('SELECT * FROM verReporteProgramada');
         }
         if(req.body.type=="En_Curso"){
            query= await pool.query('SELECT * FROM verReporteEn_Curso');
             }
             if(req.body.type=="Finalizada"){
                query= await pool.query('SELECT * FROM verReporteFinalizada');
                 }
                 if(req.body.type=="General"){
                    query= await pool.query('SELECT * FROM verReporteGeneral');
                     }
                 else
                 console.log('ERROR REPORT TYPE',req.body.type);
            res.json({ Reporte:query.rows });
        }
        catch(e){
            console.log('ERROR REPORTS QUERY ROUTE',e);
        }
};





module.exports = qryCtrlReports;