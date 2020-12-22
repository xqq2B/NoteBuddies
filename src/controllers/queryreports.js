const qryCtrlReports = {};

//const conexion = require('../conexion');?????????????????????????? todo sobre nuestra db
const { pool } = require('../database');

qryCtrlReports.QueryRoute = async (req, res) => {

    try {
        console.log(req.body);
         
            res.json({ status: 'ok' });
        }
        catch(e){
            console.log('ERROR REPORTS QUERY ROUTE',e);
        }
};





module.exports = qryCtrlReports;