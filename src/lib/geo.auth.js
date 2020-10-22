const GeotabApi = require('mg-api-js');
const geoCtrl ={};
const {pool} = require('../database');



geoCtrl.loginGeo = async (req, res) => {
    const authentication = {
        credentials: {
            database: req.body.database,
            userName: req.body.email,
            password: req.body.password
        }
    };

    try {
        const api = new GeotabApi(authentication);
        await api.authenticate(async success => {

            let text = 'SELECT * FROM Usuario WHERE correo = $1';
            let values = [req.body.email];
            const { rows } = await pool.query(text, values);
            console.log(rows);
            if (rows.length == 0) {
                let session = await api.authenticate();
                let text = 'SELECT createUsuario_Geotab($1,$2,$3)';
                let values = [session.credentials.sessionId, session.credentials.userName, session.credentials.database];//username es email
                await pool.query(text, values);
                res.json({ email: session.credentials.userName });
                res.redirect('http://35.206.82.124/finalizar_registro');
                console.log('insertado usuario GEOTAB en DB');    
            }
            else if (rows.length != 0 && rows.activo == false) {
                res.json({ email: req.bodyemail });
                res.redirect('http://35.206.82.124/finalizar_registro');//terminar registro
            }
            else {
                res.json({ rows });//,id_rol:rows.id_rol});//cambio de ok a json activo
            }
        }, (error) => {
            res.json('Wrong Credentials!');
        });
    } catch (e) {
        console.log(e);
    }
};

geoCtrl.registerGeo =async (req,res)=>{      
    User = req.body;
    console.log(User);
    try {
        let text = 'SELECT setGeotab($1,$2,$3,$4)';
        let values = [User.email, User.username, User.lastname, User.telephone];
        /*const {rows}=*/await pool.query(text, values);
        let text2 = 'SELECT * FROM vistaObtenerUsuario WHERE correo =$1';
        let value =[User.email];
        const {rows} = await pool.query(text2,value);
        console.log(rows);
        res.json({rows});//status:'Registered!',id_rol:rows.id_rol});
    } catch (e) {
        console.log(e);
    }
};


module.exports = geoCtrl;