require('./database');
const app = require('./app');
const logger = require ('./lib/logger');

app.listen(app.get('port'));
console.log(`Server on port`, app.get('port'));
logger.info('Server running on port'+ app.get('port'));
