const GeotabApi = require('mg-api-js');
const fs = require('fs');
require('dotenv').config();
//no implementado
const schedule = require('node-schedule');

const username = process.env.user_geo;
//const password = process.env.password_geo;
const database = process.env.database_geo;
var sessionIde;
var serverIde;

updateSessionId();

schedule.scheduleJob('* * 23 * * *', function () {
    updateSessionId();
});

///////////////////////////////////////////////////


//expira la sesion y trata de autenticar en ciclo por siempre


////////////////////////////////////////////////////

// const authentication = {
//     credentials: {
//         database: database,
//         userName: username,
//         password: password,
//     }
// };


async function saveSession(sessionId, server) {
    console.log('save session');
    await fs.writeFileSync("file.txt", sessionId + ',' + server, { flag: 'w' });
}


async function getSession() {
    try {
        console.log('getting session');
        const session = await fs.readFileSync('file.txt', 'utf8');
        const params = session.split(',');
        console.log(params);
        return params;

    } catch (err) {
        console.log('GETSESSIONERROR' + err);
        //getLogger.error('function getSession '+ err);
    }
}

async function updateSessionId() {
    try {
        const sessionId = await getSession();
        console.log(sessionId[0]);
        const server = await getSession();
        console.log(server[1]);
        if (!sessionId[0]) {
            const passGeoDev = await  fs.readFileSync('unknown.txt','utf8');
            console.log(passGeoDev);
            const api = await new GeotabApi({credentials:{userName:username,database:database,password:passGeoDev}});//authentication);
            console.log('paso1');
            console.log(api);
            const session = await api.authenticate();//no reconoce Async
            console.log('paso');
            await saveSession(session.credentials.sessionId, session.path);
            return api;
        } else {
            const serverIde = server[1];
            console.log(server);
            console.log('ya hay sesion');
            sessionIde = sessionId[0];
            const api = await new GeotabApi({ credentials: { userName: username, database: database, sessionId: sessionIde }, path: serverIde });//authenticationSId);//(username, null, sessionId, database, server[1]);
            console.log(api);
            return api;
        }

    } catch (err) {
        //agregado caduco sesion 12112020
        const passGeoDev = await  fs.readFileSync('unknown.txt','utf8');
        const api = await new GeotabApi({credentials:{userName:username,database:database,password:passGeoDev}});
        const session = await api.authenticate();//no reconoce Async
        await saveSession(session.credentials.sessionId, session.path);
        console.log('ERROR SESION ID' + err);
        //getLogger.error('function updateSessionId'+err);
        return api;
    }
}

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
exports.updateSessionId = updateSessionId;
exports.sessionOtherDb = sessionOtherDb;