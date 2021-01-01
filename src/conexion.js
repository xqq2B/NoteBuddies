const GeotabApi = require('mg-api-js');
const fs = require('fs');


async function sessionOtherDb(user, db, session, servo) {
    try {
        console.log(user + db + session + servo);
        const api = await new GeotabApi({ credentials: { userName: user, database: db, sessionId: session }, path: servo });
        console.log(api);

        return api;
    } catch (err) {
        console.log('ERROR SESION ID' + err);
    }
}


exports.sessionOtherDb = sessionOtherDb;






