const GeotabApi = require('mg-api-js');
const geoCtrl ={};
const {pool} = require('../database');


async function checkId (){
    const id_user = (Math.floor(Math.random() * (10000001)))+10000000;
    const text = 'SELECT * FROM usuario WHERE id_usuario= $1';//id_user
    const value =[id_user];
    const{rows}= await pool.query(text,value);
    if(rows.length>0) {
        console.log('id user repetido');
        checkId();}
    else{
        return id_user;
    } 
}





geoCtrl.loginGeo = async (req, res) => {
    const authentication = {
        credentials: {
            database: req.body.database,
            userName: req.body.email,
            password: req.body.password
        },
        path: req.body.path
    };

    try {
        const api = new GeotabApi(authentication);
        await api.authenticate(async success => {

            let text = 'SELECT * FROM Usuario WHERE correo = $1';
            let values = [req.body.email];
            const { rows } = await pool.query(text, values);
            console.log(rows);
            console.log(req.body.email);
            console.log(req.body.path);
            //const ide_usuario =rows[0].id_usuario;
            if (rows.length == 0) {
                //generar ide usuario
                var ide_user;
                await checkId().then(res => ide_user = parseInt(res));
                console.log(ide_user);
                let session = await api.authenticate();
                let text = 'SELECT createUsuario_Geotab($1,$2,$3)';
                let values = [ide_user/*session.credentials.sessionId*/, session.credentials.userName, session.credentials.database];//username es email
                await pool.query(text, values);
                ///setpath recibe session.credentials.sessionId para darle el path correcto
                let text2 = 'SELECT setPath($1,$2)';
                let values2 =[ide_user/*session.credentials.sessionId*/, req.body.path];
                await pool.query(text2,values2);
                ////////////////////////////////////////////////
                console.log(session.credentials.sessionId);
                let text3 = 'SELECT setSessionId($1,$2)';
                let values3 =[ide_user, session.credentials.sessionId];
                await pool.query(text3,values3);
                res.json({ email: session.credentials.userName });
                //await res.redirect('http://35.206.82.124/finalizar_registro');
                console.log('insertado usuario GEOTAB en DB');    
            }
            else if (rows.length != 0 && rows[0].activo == false) {
                console.log('okok');
                res.json({ email: req.body.email });
                //await res.redirect('http://35.206.82.124/finalizar_registro');//terminar registro
            }
            else {
                //agregado para enviar sessionid, database, path
                const ide_usuario =rows[0].id_usuario;
                let session = await api.authenticate();
                let text='SELECT setSessionID_Path($1,$2,$3)';//????????
                console.log(ide_usuario,session.credentials.sessionId, req.body.path)
                let values=[ide_usuario,session.credentials.sessionId, req.body.path];
                await pool.query(text,values);
                let text2='SELECT updatebd($1,$2)';
                let values2=[ide_usuario,req.body.database];
                await pool.query(text2,values2);
                console.log('debio guardar');
                //////////////////////////////////se agrego despues de rows
                res.json({status: rows[0],db:req.body.database,path:req.body.path,sessionId:session.credentials.sessionId });//cambio a status para llegue igual que login SESSION DATABASE
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
    //nuevo para api no reconocida
    //let text = 'SELECT * FROM Usuario WHERE correo = $1';
    
        ////////////////
        let text = 'SELECT setGeotab($1,$2,$3,$4)';
        let values = [User.email, User.username, User.lastname, User.telephone];
        await pool.query(text, values);
        //setGrupo(ide_usuario varchar(60),ide_grupo varchar(60))



    let text2 = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
    let values2 = [req.body.email];
    let { rows } = await pool.query(text2, values2);
    console.log(rows[0]);
    const api = await new GeotabApi({ credentials: { userName: rows[0].correo, database: rows[0].db, sessionId: rows[0].sessionId }, path: rows[0].path });
    try {
        const group = await api.call("Get", {
            typeName: "User",//si es user y es el companyGroups
            search: {
                name: User.email
            },
        });
        var groups=[];
        console.log(group[0]);
        for(var i=0;i<group[0].companyGroups.length;i++){
            groups.push(group[0].companyGroups[i].id);
        }
        console.log(groups[0].companyGroups[0].id);
        console.log(groups.length);

        for(i=0;i<groups.length;i++){
        let text3 = ('SELECT setGrupo($1,$2');
        let values2 = [User.email,groups[0].companyGroups[i].id];
        await pool.query(text3,values2);
        }
        let text2 = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
        let values2 = [req.body.email];
        let { rows } = await pool.query(text2, values2);

        // let text2 = 'SELECT * FROM vistaObtenerUsuario WHERE correo =$1';
        // let value =[User.email];
        // const {rows} = await pool.query(text2,value);
        console.log(rows);
        res.json({status:rows});//status:'Registered!',id_rol:rows.id_rol});
    } catch (e) {
        console.log(e);
    }
};


module.exports = geoCtrl;