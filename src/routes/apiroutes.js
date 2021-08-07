const { Router } = require('express');
const router = Router();


const apiCtrl = require('../controllers/apimethods');

//Notes url crud de notas
// router.get('/', indexCtrl.mainPage);
// router.get('/about', indexCtrl.aboutPage);
router.get('/all', apiCtrl.all);
router.post('/signin', apiCtrl.signIn);
router.post('/signup', apiCtrl.signUp);
router.post('/allnotes', apiCtrl.allNotes);
router.post('/editnotes', apiCtrl.editNotes);
router.post('/editednote', apiCtrl.editedNote);
router.post('/deletenote', apiCtrl.deleteNote);
// router.get('/signup', indexCtrl.signUp);
// router.post('/signedup', indexCtrl.signedUp);
// router.get('/newnotes', indexCtrl.newNotes);
// //Recibir
// router.post('/newnotes', indexCtrl.allNotes);
// router.get('/all', indexCtrl.all);
// router.get('/editnotes/:id', indexCtrl.editnotes);
// router.post('/editednote/:id', indexCtrl.editednote);
// router.post('/deletenote/:id',indexCtrl.deletenote);



// router.post('/signinn',indexCtrl.signInn);
// //Editar Ruta
// router.post('/config/routes/edit', qryCtrlRoutes.EditRoute);
// //Query Catalogo Rutas
// router.post('/config/routes/qcatalog', qryCtrlRoutes.QueryCatalogRoute);//
// //Delete Ruta
// router.delete('/config/routes/delete/:id_route', qryCtrlRoutes.DeleteRoute);//



// router.post('/report/route', qryCtrlReports.QueryRoute);

module.exports = router;