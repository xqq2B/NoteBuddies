const { Router } = require('express');
const router = Router();


const notesCtrl = require('../controllers/notesmethods');


router.get('/', notesCtrl.mainPage);
router.get('/about', notesCtrl.aboutPage);
router.post('/signin', notesCtrl.signIn);
router.get('/signup', notesCtrl.signUp);
router.post('/signedup', notesCtrl.signedUp);
router.get('/newnotes', notesCtrl.newNotes);
router.post('/newnotes', notesCtrl.allNotes);
router.get('/all', notesCtrl.all);
router.get('/editnotes/:id', notesCtrl.editnotes);
router.post('/editednote/:id', notesCtrl.editednote);
router.post('/deletenote/:id',notesCtrl.deletenote);

//router.get('/auth/fb', notesCtrl.fb);


module.exports = router;