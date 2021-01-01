const { Router } = require('express');
const router = Router();

const userCtrl = require('../controllers/users');
const geoCtrl = require('../lib/geo.auth');
const qryCtrl = require('../controllers/querycontrol');
const qryCtrlRoutes = require('../controllers/queryroutes');
const qryCtrlMonitor = require('../controllers/querymonitor');
const qryCtrlReports = require('../controllers/queryreports');


//ver todos
router.get('/', userCtrl.getUsers);

//simple login
router.post('/login', userCtrl.loginUser);

//registro usuario no activo
router.post('/register', userCtrl.registerUser);

//confirmar correo usuario cambia a activo
router.get('/confirmation/:token', userCtrl.registerConfirm);

//cambio contraseña dentro
router.post('/user/newpass', userCtrl.newPass);


//NUEVO CON POST click boton olvide contraseña
router.post('/recovery', userCtrl.getRecovery);

//asignacion nueva contraseña
router.get('/defaultPassword/:token', userCtrl.defaultPassword);

//login simple geotab
router.post('/geotab_login', geoCtrl.loginGeo);

//registro completo geotab
router.post('/geotab_register', geoCtrl.registerGeo);


//USUARIOS
//Consulta Usuarios
router.get('/config/users', qryCtrl.QueryUser);
//Alta usuarios
router.post('/config/users', qryCtrl.CreateUser);
//Edicion usuarios
router.post('/config/users/edit', qryCtrl.EditUser);
//Eliminacion usuarios
router.delete('/config/users/:id_user', qryCtrl.DelUser);

//ROLES
//Consulta Roles
router.get('/config/roles', qryCtrl.QueryRol);
//Alta Roles
router.post('/config/roles', qryCtrl.CreateRol);
//Edicion Roles
router.post('/config/roles/edit', qryCtrl.EditRol);//cambiado id_Rol new_Rol
// //Eliminacion Roles
router.delete('/config/roles/:id_Rol', qryCtrl.DelRol);


//RUTAS
//Consulta Rutas
router.post('/config/routes/query', qryCtrlRoutes.QueryRoute);
//Checkpoints
router.post('/config/routes/checkpoints', qryCtrlRoutes.QueryCheckpoints);
//Endpoints
router.post('/config/routes/endpoints', qryCtrlRoutes.QueryEndpoints);//
//Startpoints
router.post('/config/routes/startpoints', qryCtrlRoutes.QueryStartpoints);//
//Consulta Vehiculos
router.post('/config/devices', qryCtrlRoutes.QueryDevice);//vehiculos
//Consulta drivers      
router.post('/config/routes/drivers', qryCtrlRoutes.QueryDriver);
//Consulta Trailer      
router.post('/config/routes/trailers', qryCtrlRoutes.QueryTrailer);



//Crear Ruta
router.post('/config/routes/create', qryCtrlRoutes.CreateRoute);//
//Editar Ruta
router.post('/config/routes/edit', qryCtrlRoutes.EditRoute);
//Query Catalogo Rutas
router.post('/config/routes/qcatalog', qryCtrlRoutes.QueryCatalogRoute);//
//Delete Ruta
router.delete('/config/routes/delete/:id_route', qryCtrlRoutes.DeleteRoute);//



//Get Grupos
router.post('/config/routes/group', qryCtrlRoutes.QueryGroup);//probando



//GET de las rutas Configuradas
router.post('/config/routes/qall', qryCtrlRoutes.QueryAll);//get all
//Delete Ruta Configurada
router.post('/config/routes/delete/specific', qryCtrlRoutes.DeleteSpecificRoute);//
//Crear Ruta Especifica
router.post('/config/routes/create/specific', qryCtrlRoutes.CreateSpecificRoute);
//Editar Ruta Especifica
router.post('/config/routes/edit/specific', qryCtrlRoutes.EditSpecificRoute);
//Query Catalogo Rutas Especificada
router.post('/config/routes/qcatalog/specific', qryCtrlRoutes.QueryCatalogRouteSpecific);//



//MONITOREO
//Edicion Especial Checkpoints
router.post('/monitor/edit/checkpoints', qryCtrlMonitor.EditCheckPoint);
//Consulta Vehiculo PopUp
router.post('/monitor/device/info', qryCtrlMonitor.QueryDevice);
//Consultar Casos
router.post('/monitor/device/exceptions', qryCtrlMonitor.QueryExceptions);
//Consultar solo alertas
router.post('/monitor/device/alerts', qryCtrlMonitor.QueryAlerts);


//REPORTES
//Query Report Filtro
router.post('/report/route', qryCtrlReports.QueryRoute);

module.exports = router;