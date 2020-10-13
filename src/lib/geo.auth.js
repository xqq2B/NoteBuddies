const GeotabApi = require('mg-api-js');
const geoCtrl ={};
const {pool} = require('../database');


async function userRegister(api) {
    const session = await api.authenticate();
        //let text = 'SELECT createusuario($1,$2,$3,$4,$5,$6,$7,$8';
        let text = 'SELECT createUsuario_Geotab($1,$2,$3)';
        let values = [session.credentials.sessionId,session.credentials.userName,session.credentials.database];//username es email... luego cambiar
        await pool.query(text, values);
        console.log('insertado usuario GEOTAB en DB');
}


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
        await api.authenticate(success => {
            res.json('Ok!');
            userRegister(api);
        }, (error) => {
            res.json('Wrong Credentials!');
        });

        

    }catch(e){
        console.log(e);
    }
};

module.exports = geoCtrl;