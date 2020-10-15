const {Router} = require ('express');
const router = Router();

const userCtrl = require('../controllers/users');
const geoCtrl = require ('../lib/geo.auth');

//ver todos
router.get('/',userCtrl.getUsers); 

//simple login
router.post('/login',userCtrl.loginUser);

//registro usuario no activo
router.post('/register',userCtrl.registerUser);

//confirmar correo usuario cambia a activo
router.get('/confirmation/:token',userCtrl.registerConfirm);


//NUEVO CON POST click boton olvide contraseña
router.post('/recovery',userCtrl.getRecovery);

//asignacion nueva contraseña
router.get('/defaultPassword/:token',userCtrl.defaultPassword);

//login simple geotab
router.post('/geotab_login',geoCtrl.loginGeo);

//registro completo geotab
router.post('/geotab_register',geoCtrl.registerGeo);


module.exports=router;