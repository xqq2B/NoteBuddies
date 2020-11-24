const {Router} = require ('express');
const router = Router();

const userCtrl = require('../controllers/users');
const geoCtrl = require ('../lib/geo.auth');
const qryCtrl = require('../controllers/querycontrol');
const qryCtrlRoutes = require ('../controllers/queryroutes');
//ver todos
router.get('/',userCtrl.getUsers); 

//simple login
router.post('/login',userCtrl.loginUser);

//registro usuario no activo
router.post('/register',userCtrl.registerUser);

//confirmar correo usuario cambia a activo
router.get('/confirmation/:token',userCtrl.registerConfirm);

//cambio contraseña dentro
router.post('/user/newpass',userCtrl.newPass);


//NUEVO CON POST click boton olvide contraseña
router.post('/recovery',userCtrl.getRecovery);

//asignacion nueva contraseña
router.get('/defaultPassword/:token',userCtrl.defaultPassword);

//login simple geotab
router.post('/geotab_login',geoCtrl.loginGeo);

//registro completo geotab
router.post('/geotab_register',geoCtrl.registerGeo);


//USUARIOS
//Consulta Usuarios
router.get('/config/users',qryCtrl.QueryUser);
//Alta usuarios
router.post('/config/users',qryCtrl.CreateUser);
//Edicion usuarios
router.post('/config/users/edit',qryCtrl.EditUser);
//Eliminacion usuarios
router.delete('/config/users/:id_user',qryCtrl.DelUser);

//ROLES
//Consulta Roles
router.get('/config/roles',qryCtrl.QueryRol);
//Alta Roles
router.post('/config/roles',qryCtrl.CreateRol);
//Edicion Roles
router.post('/config/roles/edit',qryCtrl.EditRol);//cambiado id_Rol new_Rol
// //Eliminacion Roles
router.delete('/config/roles/:id_Rol',qryCtrl.DelRol);


//RUTAS
//Consulta Rutas
router.post('/config/routes/query',qryCtrlRoutes.QueryRoute);
//Checkpoints
router.post('/config/routes/checkpoints',qryCtrlRoutes.QueryCheckpoints);
//Consulta Vehiculos
router.post('/config/devices',qryCtrlRoutes.QueryDevice);//vehiculos
//Consulta drivers      
router.post('/config/routes/drivers',qryCtrlRoutes.QueryDriver);
//Consulta Trailer      
router.post('/config/routes/trailers',qryCtrlRoutes.QueryTrailer);
//Crear Ruta
router.post('/config/routes/create',qryCtrlRoutes.CreateRoute);//falla agregar mes
//Editar Ruta
router.post('/config/routes/edit',qryCtrlRoutes.EditRoute);//aun no listo
//GET de las rutas
router.post('/config/routes/qall',qryCtrlRoutes.QueryAll);//get all
//Delete Ruta
router.delete('/config/routes/delete',qryCtrlRoutes.DeleteRoute);//get all


module.exports=router;