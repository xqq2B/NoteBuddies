const mongo = require('mongoose');
require('dotenv').config();
const logger = require ('./lib/logger');

async function database() {
    try {
        mongo.connect('mongodb://localhost/noteBuddies', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }).then(db => console.log('DB is connected'), logger.info('DB is connected'))
            .catch(err => database());
    } catch (e) {
        console.log(e);
        logger.info('Error: '+e);
    }
}

database();

