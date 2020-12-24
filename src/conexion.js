const GeotabApi = require('mg-api-js');
const fs = require('fs');


/////////////COMENTADO LINEA 6 a la 187
// require('dotenv').config();

//  const schedule = require('node-schedule');

// const geoCtrl ={};
// //const {pool} = require('../src/database');

// const passGeoDev = fs.readFileSync('unknown.txt','utf8');


// async function checkId (){
//     const id_user = (Math.floor(Math.random() * (10000001)))+10000000;
//     const text = 'SELECT * FROM usuario WHERE id_usuario= $1';//id_user
//     const value =[id_user];
//     const{rows}= await pool.query(text,value);
//     if(rows.length>0) {
//         console.log('id user repetido');
//         checkId();}
//     else{
//         return id_user;
//     } 
// }


// schedule.scheduleJob('00 45 16 * * *', function () {//'* * 23 * * *''22 13 16 * * *'
//     service();
// });


// //geoCtrl.loginGeo = async (req, res) => 
// async function service(req,res) {
//     const authentication = {
//         credentials: {
//             database: process.env.database_vita,
//             userName: process.env.user_geo,
//             password: passGeoDev
            
//         },
//         path: process.env.pathh
//     };
//     console.log('entreeee1111111111');
//     try {
       
//         const api = new GeotabApi(authentication);
//         console.log(api);
//         await api.authenticate(async success => {
//             console.log('entreeeeeeeeeeeeee');
//             let text = 'SELECT * FROM Usuario WHERE correo = $1';
//             let values = [process.env.user_geo];
//             const { rows } = await pool.query(text, values);
//             console.log(rows);
//             console.log(process.env.user_geo);
//             console.log(process.env.pathh);
//             //const ide_usuario =rows[0].id_usuario;
//             // if (rows.length == 0) {
//             //     //generar ide usuario
//             //     var ide_user;
//             //     await checkId().then(res => ide_user = parseInt(res));
//             //     console.log(ide_user);
//             //     let session = await api.authenticate();
//             //     let text = 'SELECT createUsuario_Geotab($1,$2,$3)';
//             //     let values = [ide_user, session.credentials.userName, session.credentials.database];//username es email
//             //     await pool.query(text, values);
//             //     ///setpath recibe session.credentials.sessionId para darle el path correcto
//             //     let text2 = 'SELECT setPath($1,$2)';
//             //     let values2 =[ide_user/*session.credentials.sessionId*/, process.env.pathh];
//             //     await pool.query(text2,values2);

//             //     let text3 = 'SELECT setSessionId($1,$2)';
//             //     let values3 =[ide_user, session.credentials.sessionId];
//             //     await pool.query(text3,values3);
//             //     /////////////////////agregado 28 nov 11am para iniciar con grupos
//             //     const group = await api.call("Get", {
//             //         typeName: "User",
//             //         search: {
//             //             name: process.env.user_geo
//             //         },
//             //     });
//             //     console.log(group[0].companyGroups.length);
//             //     var groups=[];
//             //     for (var i = 0; i < group[0].companyGroups.length; i++) {
//             //         groups.push(group[0].companyGroups[i].id);
//             //     }
//             //     console.log(groups.length);

//             //     for (i = 0; i < groups.length; i++) {
//             //         let text3 = ('SELECT setGrupo($1,$2)');
//             //         let values2 = [process.env.user_geo, groups[0]];
//             //         await pool.query(text3, values2);
//             //     }
//             //     /////////////////////////////////////////////////
//             //     console.log(session.credentials.sessionId);
//             //     res.json({ email: session.credentials.userName });
//             //     //await res.redirect('http://35.206.82.124/finalizar_registro');
//             //     console.log('insertado usuario GEOTAB en DB');    
//             // }
//             // else if (rows.length != 0 && rows[0].activo == false) {
//             //     console.log('okok');
//             //     res.json({ email: process.env.user_geo });
//             //     //await res.redirect('http://35.206.82.124/finalizar_registro');//terminar registro
//             // }
//             // else {
//                 //agregado para enviar sessionid, database, path
//                 const ide_usuario =rows[0].id_usuario;
//                 let session = await api.authenticate();
//                  text='SELECT setSessionID_Path($1,$2,$3)';//????????
//                 console.log(ide_usuario,session.credentials.sessionId, process.env.pathh);
//                  values=[ide_usuario,session.credentials.sessionId, process.env.pathh];
//                 await pool.query(text,values);
//                 let text2='SELECT updatebd($1,$2)';
//                 let values2=[ide_usuario,process.env.database_vita];
//                 await pool.query(text2,values2);
//                 console.log('debio guardar');
//                 /////AGREGADO 11AM PONER GRUPOS
//                 let del=('SELECT deleteGrupos($1)');
//                 let val=[ide_usuario];
//                 await pool.query(del,val);
//                 // let text3 = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
//                 // let values3 = [req.body.email];
//                 // let result = await pool.query(text3, values3);
//                 const group = await api.call("Get", {
//                     typeName: "User",
//                     search: {
//                         name: process.env.user_geo
//                     },
//                 });
//                 console.log(group[0].companyGroups.length);
//                 var groupss = [];
//                 console.log(group[0].companyGroups);
//                 console.log(group[0].companyGroups[0].id);
//                 for (var j = 0; j < group[0].companyGroups.length; j++) {
//                     groupss.push(group[0].companyGroups[j].id);
//                     console.log('entre');
//                 }
//                 console.log(groupss[0]);
//                 console.log(groupss.length);

//                 for (var l = 0; l < groupss.length; l++) {
//                     let text3 = ('SELECT setGrupo($1,$2)');
//                     let values22 = [process.env.user_geo, groupss[0]];
//                     await pool.query(text3, values22);
//                 }
//                 console.log('paso insertar grupo');

//                 let textt = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
//                 let valuess = [process.env.user_geo];
//                 let results = await pool.query(textt, valuess);

//                 res.json({ status: results.rows[0] });
//                 //////////////////////////////////se agrego despues de rows
//                 //res.json({status: rows[0],db:req.body.database,path:req.body.path,sessionId:session.credentials.sessionId });//cambio a status para llegue igual que login SESSION DATABASE
            
//         }, (error) => {
//             res.json('Wrong Credentials!');
//         });
//     } catch (e) {
//         console.log(e);
//     }
// }



// geoCtrl.registerGeo =async (req,res)=>{    
//     try {  
//     User = req.body;
//     console.log(User);
//     //nuevo para api no reconocida
//     //let text = 'SELECT * FROM Usuario WHERE correo = $1';
    
//         ////////////////
//         let text = 'SELECT setGeotab($1,$2,$3,$4)';
//         let values = [process.env.user_geo, 'Rodolfo', 'Chavarria', '9876543210'];
//         await pool.query(text, values);
       
//         let textt = 'SELECT * FROM vistaObtenerUsuario WHERE correo = $1';
//         let valuess = [process.env.user_geo];
//         let result = await pool.query(textt, valuess);
//         res.json({status:result.rows[0]});//status:'Registered!',id_rol:rows.id_rol});
//     } catch (e) {
//         console.log(e);
//     }
// };

//SPRINT 3

async function sessionOtherDb(user, db, session, servo) {
    try {
        console.log(user + db + session + servo);
        const api = await new GeotabApi({ credentials: { userName: user, database: db, sessionId: session }, path: servo });
        console.log(api);
       
        return api;
    } catch (err) {
        //const api = new GeotabApi(username, password, null, database, server);
        //const session = await api.authenticateAsync();
        //await saveSession(session.credentials.sessionId, session.path);
        console.log('ERROR SESION ID' + err);
    }
}


//exports.updateSessionId = updateSessionId;
exports.sessionOtherDb = sessionOtherDb;





//const fs = require('fs');
// require('dotenv').config();
// //no implementado
// const schedule = require('node-schedule');

// const username = process.env.user_geo;
// //const password = process.env.password_geo;
// const database = process.env.database_geo;
// var sessionIde;
// var serverIde;

//AL PARECER NODE SCHEDULE CICLABA LA PAGINA ULTIMA REVISION 1 DE DICIEMBRE 5PM
// schedule.scheduleJob('* * 23 * * *', function () {//'* * 23 * * *'
//     updateSessionId();
// });

///////////////////////////////////////////////////


//expira la sesion y trata de autenticar en ciclo por siempre
//al parecer faltaba cuando da error de credenciales pero se corrigio
//y se calento el cpu el sabado 14 nov ppor el ciclo, esperar a que venza la sesion
//intentar meter sesion erronea a ver que pasa
////////////////////////////////////////////////////

// const authentication = {
//     credentials: {
//         database: database,
//         userName: username,
//         password: password,
//     }
// };


// async function saveSession(sessionId, server) {
//     console.log('save session');
//     fs.writeFileSync("file.txt", sessionId + ',' + server, { flag: 'w' });
//     //actua como promesa pero no es... require fs promises.
//     //ver documentacion para usarlo como promesa.
// }

// //fuera await y async
//  function getSession() {
//     try {
//         console.log('getting session');
//         const session = fs.readFileSync('file.txt', 'utf8');
//         const params = session.split(',');
//         //console.log(params);
//         return params;

//     } catch (err) {
//         console.log('GETSESSIONERROR' + err);//
//         //getLogger.error('function getSession '+ err);
//     }
// }

// async function updateSessionId() {
//     try {
//         const sessionId = await getSession();
//         console.log(sessionId[0]);
//         const server = await getSession();
//         console.log(server[1]);
//         if (!sessionId[0]) {//quitado !
//             const passGeoDev =   fs.readFileSync('unknown.txt','utf8');
//             //console.log(passGeoDev);
//         const api = await new GeotabApi({credentials:{userName:username,database:database,password:passGeoDev}});//authentication);
            
//             console.log(api);
//             const session = await api.authenticate();//no reconoce Async
//             console.log('paso');
//             await saveSession(session.credentials.sessionId, session.path);
//             return api;
//         } else {
//             const serverIde = server[1];
//             const sessionIde = sessionId[0];
//             console.log('ya hay sesion');
//             ///const api = await new GeotabApi({ credentials: { userName: username, database: database, sessionId: sessionIde }, path: serverIde });//authenticationSId);//(username, null, sessionId, database, server[1]);
//             //agregado la linea siguiente
//             const api = new GeotabApi({ credentials: { userName: username, database: database, sessionId: sessionIde }, path: serverIde });
//             // const muestra=await api.call("Get", {
//             //     typeName: "User",//si es user y es el companyGroups
//             //     search: {
//             //     },
//             //   resultsLimit:5
//             // });
            
//             // console.log(muestra);
//             // console.log(muestra[0].companyGroups);
//             // const zones = await api.call("Get", {
//             //     typeName: "Group",//para sacar id
//             //     search: {
//             //         "name": "rutas"
//             //         //checkpoints
//             //     }
//             // });
//             // console.log(zones[0]);
//             // const zonesRoutes = await api.call("Get", {
//             //     typeName: "Zone",
//             //     search: {
//             //     },
//             //     resultsLimit:1
//             // });
            
//             // console.log(zonesRoutes)
//             console.log('Credentials ok!');
//             return api;
//         }

//     } catch (err) {
//         const passGeoDev = fs.readFileSync('unknown.txt','utf8');
//          const api =  new GeotabApi({credentials:{userName:username,database:database,password:passGeoDev}});
//          console.log('entro a error');
//         const session = await api.authenticate();
//         console.log(session);
//         await saveSession(session.credentials.sessionId, session.path);
//         console.log('ERROR SESION ID' + err);
//         //getLogger.error('function updateSessionId'+err);
//         return api;
//     }
// }
