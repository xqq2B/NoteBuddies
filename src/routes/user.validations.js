const {Router} = require ('express');
const router = Router();

const userCtrl = require('../controllers/users');

router.get('/',userCtrl.getUsers);

router.post('/',userCtrl.postUser);


router.post('/:username',userCtrl.newLogin);


router.post('/:mail',userCtrl.getRecovery);



module.exports=router;