const GeotabApi = require('mg-api-js');
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

//SPRINT 3

async function sessionOtherDb(user, db, session, servo) {
    try {
        console.log(user + db + session + servo);
        const api = await new GeotabApi({ credentials: { userName: user, database: db, sessionId: 'hDAQRbL_gXBDXOZ5a2bKwg'/*session*/ }, path: 'my167.geotab.com'/*servo*/ });
        console.log(api);
        await api.call('Get', { typeName: 'Device'  ,resultLimits:1})
        .then(result => {
            console.log('hola');
            console.log(result.lenght);
            
           
        })
        .catch(error => {
            console.log('errorororororor', error);
        });
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