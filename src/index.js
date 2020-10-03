require('./database');
const app = require ('./app');

//server
app.listen(app.get('port'));
console.log(`Server on port`,app.get('port'));

