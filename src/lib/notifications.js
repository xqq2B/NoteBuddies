const nodemailer = require('nodemailer');
const jwt =require('jsonwebtoken');
require('dotenv').config();

const EMAIL_SECRET = process.env.EMAIL_SECRET;
const EMAIL_SECRET_PASS = process.env.EMAIL_SECRET_PASS;
const EMAIL_NODE = process.env.EMAIL_NODE;
const EMAIL_PASS_NODE = process.env.EMAIL_PASS_NODE;


function sendWelcomeEmail (User){
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: EMAIL_NODE,
      pass: EMAIL_PASS_NODE
    },
  });

console.log(User.id_user);
jwt.sign(
{
    
    user:(User.id_user),
},
EMAIL_SECRET,
{
    expiresIn:'1d',
},
(err,emailToken)=>{
    const url =`http://35.206.82.124/api/auth/confirmation/${emailToken}`;

    transporter.sendMail({
        to: User.email,
        subject:'Confirm Email',
        html: `Por favor da click en el enlace para confirmar tu correo: <a href="${url}">${url}</a>, `,
        text: 'Link vence en 24 horas'

        });
    },
);
}

function sendEmailRec (userId,mail,nPass){
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: EMAIL_NODE,
          pass: EMAIL_PASS_NODE
        },
      });
    
    console.log(userId);
    jwt.sign(
    {
        
        user:(userId),
        pass:(nPass),
    },
    EMAIL_SECRET_PASS,
    {
        expiresIn:'1d',
    },
    (err,emailToken)=>{
        const url =`http://35.206.82.124/api/auth/defaultPassword/${emailToken}`;
    
        transporter.sendMail({
            to: mail,
            subject:'Password Recovery',
            html: `Tu nuevo password es: ${nPass}, vence en 24 horas. Click en el siguiente link <a href="${url}">${url}</a> para utilizarlo 
            o simplemente ignora este correo si no deseas realizar cambios `,
            text: 'Link vence en 24 horas'
    
            });
        },
    );
    }

module.exports ={
    sendWelcomeEmail,
    sendEmailRec
};