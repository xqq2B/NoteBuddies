const qryCtrlMonitor = {};
//const conexion = require('../conexion');
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
            for (let y = 0; y < rows.length; y++) {
                //let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
                let text2 = 'SELECT edicionRuta_Checkpoint($1,$2,$3,$4,$5)';
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


module.exports = qryCtrlMonitor;