const GeotabApi = require('mg-api-js');
const fs = require ('fs');
require('dotenv').config();
//no implementado
const schedule = require('node-schedule');

const username = process.env.user_geo;
const password = process.env.password_geo;
const database = process.env.database_geo;
var sessionId;
var server;

updateSessionId();

schedule.scheduleJob('* * 23 * * *', function () {
    updateSessionId();
});



const authentication = {
    credentials: {
        database: database,
        userName: username,
        password: password,
        sessionId: sessionId
    },
    path: server,
};


async function saveSession (sessionId,server){
    console.log('save session');
    await fs.writeFileSync("file.txt", sessionId + ',' + server, { flag: 'w' });
}


async function getSession(){
    try{
        console.log('getting session');
        const session = await  fs.readFileSync('file.txt','utf8');
        const params = session.split(',');
        console.log(params);
        return params;

    }catch(err){
        console.log('GETSESSIONERROR'+err);
        //getLogger.error('function getSession '+ err);
    }
}

async function updateSessionId(){
    try{
        sessionId = await getSession();
        console.log(sessionId[0]);
        server = await getSession();
        console.log(server[1]);
        if(!sessionId[0]){
            console.log('entre');
            const api = new GeotabApi(authentication);
            console.log('sali');
            const session = await api.authenticate();//no reconoce Async
            await saveSession(session.credentials.sessionId, session.path);
            return api;
        } else {
            console.log('ya hay sesion');
            const api = new GeotabApi(authentication);//(username, null, sessionId, database, server[1]);
            return api;
        }

    } catch (err) {
        // const api = new GeotabApi(username, password, null, database, server);
        // const session = await api.authenticateAsync();
        // await saveSession(session.credentials.sessionId, session.path);
        console.log('ERROR SESION ID' + err);
        //getLogger.error('function updateSessionId'+err);
        //return api;
    }
}
