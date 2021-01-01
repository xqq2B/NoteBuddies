const GeotabApi = require('mg-api-js');
const geoCtrl = {};
const { pool } = require('../database');


async function checkId() {
    const id_user = (Math.floor(Math.random() * (10000001))) + 10000000;
    const text = 'SELECT * FROM usuario WHERE id_usuario= $1';//id_user
    const value = [id_user];
    const { rows } = await pool.query(text, value);
    if (rows.length > 0) {
        checkId();
    }
    else {
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
            if (rows.length == 0) {
                await checkId().then(res => ide_user = parseInt(res));
                let session = await api.authenticate();
                let text = 'SELECT createUsuario_Geotab($1,$2,$3)';
                let values = [ide_user, session.credentials.userName, session.credentials.database];//username es email
                await pool.query(text, values);
                ///setpath recibe session.credentials.sessionId para darle el path correcto
                let text2 = 'SELECT setPath($1,$2)';
                let values2 = [ide_user/*session.credentials.sessionId*/, req.body.path];
                await pool.query(text2, values2);

                let text3 = 'SELECT setSessionId($1,$2)';
                let values3 = [ide_user, session.credentials.sessionId];
                await pool.query(text3, values3);

                const group = await api.call("Get", {
                    typeName: "User",
                    search: {
                        name: req.body.email
                    },
                });

                var groups = [];
                for (var i = 0; i < group[0].companyGroups.length; i++) {
                    groups.push(group[0].companyGroups[i].id);
                }

                for (i = 0; i < groups.length; i++) {
                    let text3 = ('SELECT setGrupo($1,$2)');
                    let values2 = [req.body.email, groups[0]];
                    await pool.query(text3, values2);
                }

                res.json({ email: session.credentials.userName });
                //await res.redirect('http://35.206.82.124/finalizar_registro');
            }
            else if (rows.length != 0 && rows[0].activo == false) {
                res.json({ email: req.body.email });
            }
            else {
                const ide_usuario = rows[0].id_usuario;
                let session = await api.authenticate();
                let text = 'SELECT setSessionID_Path($1,$2,$3)';
                let values = [ide_usuario, session.credentials.sessionId, req.body.path];
                await pool.query(text, values);
                let text2 = 'SELECT updatebd($1,$2)';
                let values2 = [ide_usuario, req.body.database];
                await pool.query(text2, values2);

                let del = ('SELECT deleteGrupos($1)');
                let val = [ide_usuario];
                await pool.query(del, val);

                const group = await api.call("Get", {
                    typeName: "User",
                    search: {
                        name: req.body.email
                    },
                });

                var groupss = [];
                for (var j = 0; j < group[0].companyGroups.length; j++) {
                    groupss.push(group[0].companyGroups[j].id);
                }

                for (var l = 0; l < groupss.length; l++) {
                    let text3 = ('SELECT setGrupo($1,$2)');
                    let values22 = [req.body.email, groupss[0]];
                    await pool.query(text3, values22);
                }

                let textt = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
                let valuess = [req.body.email];
                let results = await pool.query(textt, valuess);

                res.json({ status: results.rows[0] });
            }
        }, (error) => {
            res.json('Wrong Credentials!');
        });
    } catch (e) {
        console.log(e);
    }
};



geoCtrl.registerGeo = async (req, res) => {
    try {
        User = req.body;

        let text = 'SELECT setGeotab($1,$2,$3,$4)';
        let values = [User.email, User.username, User.lastname, User.telephone];
        await pool.query(text, values);

        let textt = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
        let valuess = [req.body.email];
        let result = await pool.query(textt, valuess);
        res.json({ status: result.rows[0] });
    } catch (e) {
        console.log(e);
    }
};


module.exports = geoCtrl;
