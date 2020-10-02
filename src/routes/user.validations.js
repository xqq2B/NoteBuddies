const {Router} = require ('express');
const router = Router();

const userCtrl = require('../controllers/users');

router.get('/signin',userCtrl.getUser);
router.post('/signin',userCtrl.getUser);

router.post('/signup',userCtrl.newUser);
router.get('/signup',userCtrl.newUser)



module.exports=router;