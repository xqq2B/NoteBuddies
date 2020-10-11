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
    (err, emailToken) => {
        const url = `http://35.209.128.105/api/auth/confirmation/${emailToken}`;

        transporter.sendMail({
            to: User.email,
            subject: 'Confirm Email',
            html: `<h3>Por favor da click en el enlace para finalizar tu registro:<br><br>
        <a href="${url}">${url}</a><br><br></h3> 
        <h4>El enlace vence en 24 horas</h4><br><br>
        <img src='cid:logo'/><br>
        
        <hr>
        <h6>Política de privacidad. Métrica Móvil, S.A. de C.V., (Métricamóvil), con domicilio fiscal en Calle Heliotropos No 5, Int. 100, Col. Torreón Jardín, Torreón, Coahuila, C.P. 27200, es responsable del uso y protección de sus datos personales y al respecto le informa lo siguiente. Los datos personales que recabamos de usted, los utilizaremos para las finalidades que son necesarias para los servicios y productos que solicita: Para la comercialización de productos y servicios de telemetría y geolocalización; dar cumplimiento a las obligaciones contractuales contraídas con nuestros clientes; para le expedición y validez de garantías en la adquisición de dispositivos o productos.

        De manera adicional, utilizaremos su información personal para las siguientes finalidades que no son necesarias para los bienes productos o servicios solicitados, pero que nos permiten y facilitan proporcionarle una mejor atención: consulta de referencias bancarias en la adquisición de nuestros productos o servicios; expedición de garantías; cotización de nuevos productos o servicios solicitados; actualización de información; suscripción a boletín publicitario.

        En caso de que no desee que sus datos personales sean tratados para los fines adicionales, nos puede comunicar lo anterior contactándonos al número telefónico (01) 871-689-0645, "Departamento de Privacidad", por conducto del Departamento Contable, donde le indicarán el procedimiento. Para conocer mayor información sobre los términos y condiciones en que serán tratados sus datos personales, como los terceros con quienes compartimos su información personal y la forma en que podrá ejercer sus derechos ARCO, puede consultar el aviso de privacidad integral ingresando a nuestro sitio web https://www.metricamovil.com, al número telefónico (01) 871-689-0645, o en el domicilio fiscal antes señalado.</h6> `,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/../config/img/logo.png',
                cid: 'logo'
            }]
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
        const url =`http://35.209.128.105/api/auth/defaultPassword/${emailToken}`;
    
        transporter.sendMail({
            to: mail,
            subject:'Password Recovery',
            html: `<h3>Ha solicitado recuperación de su contraseña.<br><br>
            
            Nueva contraseña: ${nPass} <br><br>
            
            El enlace vence en 24 horas, puede activar su nueva contraseña temporal dando click en el siguiente link:<br><br>

            <a href="${url}">${url}</a><br><br>


            Si usted no ha solicitado dicho cambio, solo ignore este mensaje.<br><br></h3>


            <img src='cid:logo'/><br>
            <hr>
            <h6>Política de privacidad. Métrica Móvil, S.A. de C.V., (Métricamóvil), con domicilio fiscal en Calle Heliotropos No 5, Int. 100, Col. Torreón Jardín, Torreón, Coahuila, C.P. 27200, es responsable del uso y protección de sus datos personales y al respecto le informa lo siguiente. Los datos personales que recabamos de usted, los utilizaremos para las finalidades que son necesarias para los servicios y productos que solicita: Para la comercialización de productos y servicios de telemetría y geolocalización; dar cumplimiento a las obligaciones contractuales contraídas con nuestros clientes; para le expedición y validez de garantías en la adquisición de dispositivos o productos.

            De manera adicional, utilizaremos su información personal para las siguientes finalidades que no son necesarias para los bienes productos o servicios solicitados, pero que nos permiten y facilitan proporcionarle una mejor atención: consulta de referencias bancarias en la adquisición de nuestros productos o servicios; expedición de garantías; cotización de nuevos productos o servicios solicitados; actualización de información; suscripción a boletín publicitario.

            En caso de que no desee que sus datos personales sean tratados para los fines adicionales, nos puede comunicar lo anterior contactándonos al número telefónico (01) 871-689-0645, "Departamento de Privacidad", por conducto del Departamento Contable, donde le indicarán el procedimiento. Para conocer mayor información sobre los términos y condiciones en que serán tratados sus datos personales, como los terceros con quienes compartimos su información personal y la forma en que podrá ejercer sus derechos ARCO, puede consultar el aviso de privacidad integral ingresando a nuestro sitio web https://www.metricamovil.com, al número telefónico (01) 871-689-0645, o en el domicilio fiscal antes señalado.</h6>`,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/../config/img/logo.png',
                cid: 'logo'
            }]
        });
        },
    );
    }

module.exports ={
    sendWelcomeEmail,
    sendEmailRec
};