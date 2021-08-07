const notesCtrl = {};
const Pool = require('../models/notes');
const PoolUser = require('../models/User');
const fetch = require('node-fetch');
require('dotenv').config;
const logger = require ('../lib/logger');


notesCtrl.mainPage = async (req, res) => {
    logger.info('Showing index');
    res.render('index');
};

notesCtrl.aboutPage = async (req, res) => {
    // const { rows } = await pool.query('SELECT * FROM vistaObtenerUsuario');
    // res.json(rows);
    logger.info('Showing about');
    res.render('about');
};




notesCtrl.signIn = async (req, res) => {
    const {user, pass}= req.body;
    logger.info('Trying to login with user: '+user);
      fetch('http://localhost:3389/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
        user: user,
        pass: pass
    }),
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json())
  .then(json => {
      if(json.text=='ok')
    res.redirect('all');
    else{
        let errors=[];
        errors.push({text:json.text});
        console.log(errors)
        res.render('index',{errors,user});
    }
    
  })
  .catch(err => console.log(err))
};

notesCtrl.signUp = async (req, res) => {
    res.render('signup');
};

notesCtrl.signedUp = async (req, res) => {
    const {user, pass, pass2, tel, mail}= req.body;
    const errors=[];
    logger.info('Attempt to register');
    console.log(req.body);
    fetch('http://localhost:3389/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
            user: user,
            pass: pass,
            pass2:pass2,
            tel:tel,
            mail:mail
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => {
          if(json=='ok')
        res.redirect('/');
        else{
            let errors=[];
            for(let i = 0; i<json.length;i++){
                errors.push({text:json[i].text});
            }
            res.render('signup',{errors,user,tel,mail});
        }
        
      })
      .catch(err => console.log(err))
};

notesCtrl.allNotes= async (req, res) => {
    // const { rows } = await pool.query('SELECT * FROM vistaObtenerUsuario');
    // res.json(rows);
    logger.info('Showing all notes');
    res.render('allnotes');
};

notesCtrl.newNotes = async (req, res) => {
    logger.info('Showing new notes');
    res.render('newnotes');
}

notesCtrl.allNotes = async (req, res) => {
    const {title, message}= req.body;
    logger.info('Attempt to create note');
    fetch('http://localhost:3389/api/auth/allnotes', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            message: message
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => {
          if(json=='ok')
        res.redirect('all');
        else{
            let errors=[];
            for(let i = 0; i<json.length;i++){
                errors.push({text:json[i].text});
            }
            // errors.push({text:json.text});
            console.log(json)
            res.render('newnotes',{errors,message,title});
        }
      })
      .catch(err => console.log(err),logger.info('Error: '+err))
};

notesCtrl.all = async (req, res) => {

    fetch('http://localhost:3389/api/auth/all')
    .then(res => res.json())
    .then(json => {
            console.log(json);
            const allNotes= json;
          res.render('allnotes',{allNotes});
    });
}


notesCtrl.editnotes= async (req, res) => {
    logger.info('Attempt to get edit notes');
    fetch('http://localhost:3389/api/auth/editnotes', {
        method: 'POST',
        body: JSON.stringify({
            id: req.params.id
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => {
          let Note = json;
         res.render('editnotes',{Note});
      })
      .catch(err => console.log(err),logger.info('Error: '+err))
}

notesCtrl.editednote= async (req, res) => {
     const {title, message} = req.body;
     logger.info('Attempt to edit note');
    // await Pool.findByIdAndUpdate(req.params.id, {title, message});
    // res.redirect('../all');
    fetch('http://localhost:3389/api/auth/editednote', {
        method: 'POST',
        body: JSON.stringify({
            id: req.params.id,
            title:title,
            message:message
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => {
          res.redirect('../all');
      })
      .catch(err => console.log(err),logger.info('Error: '+err))
}

notesCtrl.deletenote = async (req, res) => {
    logger.info('Attempt to delete note id: '+req.params.id);
    fetch('http://localhost:3389/api/auth/deletenote', {
        method: 'POST',
        body: JSON.stringify({
            id: req.params.id
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => {
          res.redirect('../all');
      })
      .catch(err => console.log(err),logger.info('Error: '+err))
}


  

module.exports = notesCtrl;