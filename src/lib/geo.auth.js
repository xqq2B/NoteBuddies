const GeotabApi = require('mg-api-js');
const geoCtrl ={}

geoCtrl.loginGeo =async (req,res)=>{       
    const authentication = {
        credentials: {
            database: req.body.database,
            userName: req.body.username,
            password: req.body.password
        }}
    try{
        const api = new GeotabApi(authentication);
        await api.authenticate( success => {
            res.json({status:'Ok'});
        }, (error) => {
            res.json({status:'No Valido'});
        });
    }catch(e){
        console.log(e);
    }
};

module.exports = geoCtrl;