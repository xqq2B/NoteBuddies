const apiCtrl = {};
const Pool = require('../models/notes');
const PoolUser = require('../models/User');
//const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const { sendWelcomeEmail, sendEmailRec } = require('../lib/notifications');
const logger = require ('../lib/logger');

const Encrypt = {};

Encrypt.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    logger.info('Password encrypted');
    return hash;
};

Encrypt.matchPassword = async (password, savedPassword) => {
    try {
        logger.info('Checking Passwords');
        return await bcrypt.compare(password, savedPassword);
    } catch (err) {
        logger.info(err);
        console.log(err);
    }

};


apiCtrl.mainPage = async (req, res) => {
    // const { rows } = await pool.query('SELECT * FROM vistaObtenerUsuario');
    // res.json(rows);
    res.render('index');
};

apiCtrl.aboutPage = async (req, res) => {
    // const { rows } = await pool.query('SELECT * FROM vistaObtenerUsuario');
    // res.json(rows);
    res.render('about');
};

apiCtrl.signIn = async (req, res) => {
    let mailUser = await PoolUser.findOne({user:req.body.user});
    console.log(mailUser);
    if(!mailUser){
        let userInfo = await PoolUser.findOne({user:req.body.user});
        if(!userInfo){
            logger.info('User not valid: '+req.body.user);
            res.json({text: 'Usuario no valido'});
        }
    }
    if(mailUser){
        const OkPass = await Encrypt.matchPassword(req.body.pass, mailUser.pass);
        if(!OkPass){
            logger.info('Incorrect Password for user: '+req.body.user);
            res.json({text: 'Contraseña no valida'});
        }
        else{
        res.json({text: 'ok'});
        logger.info('Login Successful for user: '+req.body.user);
        }
    }
    //let passUser = await PoolUser.findOne({pass:req.body.pass});
    // if(!passUser){
    //     res.json({text: 'Contraseña no valida'});
    // }
}

apiCtrl.signUp = async (req, res) => {
    const {user, pass, pass2, tel, mail}= req.body;
    const errors=[];
    if(pass != pass2)
    errors.push({text: 'Contraseñas no coinciden'});
    if(pass.length<6)
    errors.push({text: 'Contraseña debe ser mayor a 6 caracteres'});
    if(tel.length!=10)
    errors.push({text: 'Telefono debe ser a 10 digitos'});
    if(user.length<5)
    errors.push({text: 'Nombre de usuario minimo de 5 caracteres'});
    const mailUser = await PoolUser.findOne({mail:mail});
    if(mailUser){
    errors.push({text: 'Correo ya esta registrado'});
    }
    if(errors.length > 0){
        logger.info('Registration error: '+ JSON.stringify(errors));
        res.json(errors);
    }
    else{
        let encPass = await Encrypt.encryptPassword(pass);
        const userInfo = new PoolUser({user, pass:encPass, mail, tel});
        await userInfo.save();
        logger.info('Registration complete!');
        res.json('ok');
    }
}

apiCtrl.allNotes = async (req, res) => {
    const { title, message } = req.body;
    const errors = [];
    if (title.length < 5)
        errors.push({ text: 'Titulo muy corto!' });
    if (title.length > 15)
        errors.push({ text: 'Titulo demasiado largo!' });
    if (message.length < 40)
        errors.push({ text: 'Nota muy corta!' });
    if (title.length > 400)
        errors.push({ text: 'Nota demasiado larga!' });
    if (errors.length > 0) {
        logger.info('Note creation error: ' + JSON.stringify(errors));
        res.json(errors);
    }
    else {
        const newNote = new Pool({ title, message });
        await newNote.save();
        logger.info('Note created!');
        res.json('ok');
    }
}

apiCtrl.all = async (req, res) => {
    //Pool.find{title:'coincidan con'});
    const allNotes = await Pool.find().lean().sort({date:'desc'});
    logger.info('Getting all user notes');
    res.json(allNotes);
}

apiCtrl.editNotes= async (req, res) => {
    const Note = await Pool.findById(req.body.id).lean();
    logger.info('Getting note by id: '+req.body.id);
    res.json(Note);
}

apiCtrl.editedNote= async (req, res) => {
    const {title, message, id} = req.body;
    await Pool.findByIdAndUpdate(id, {title, message});
    logger.info('Note edited! by user id: '+id);
    res.json('ok');
    //falta comprobacion de tama;os
}

apiCtrl.deleteNote = async (req, res) => {
    await Pool.findByIdAndDelete(req.body.id);
    logger.info('Note deleted! by user id: '+req.body.id);
    res.json('ok');
}




module.exports = apiCtrl;