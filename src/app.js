const express = require('express');
const htm = require('express-handlebars');
const path = require('path');
const mOride = require('method-override');
const session = require ('express-session');
//const passport = require('passport');


require('dotenv').config();

//const FacebookStrategy = require('passport-facebook').Strategy;


const app = express();

// app.use(passport.initialize());
// app.use(passport.session());


app.set('port', process.env.port || 3389);
app.set('views', path.join(__dirname,'views'));
app.engine('.html', htm({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.html'
}));
app.set('view engine', '.html');

app.use(express.urlencoded({extended:false}));
app.use(mOride('_method'));
app.use(session({
    secret:'notesecret',
    resave:true,
    saveUninitialized:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// passport.use(new FacebookStrategy({
//     clientID: process.env.CLIENT_ID_FB,
//     clientSecret: process.env.CLIENT_SECRET_FB,
//     callbackURL: "http://localhost:3089/auth/fb"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     PoolUser.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.use('/api/auth', require('./routes/apiroutes'));
app.use(require('./routes/routesvalidations'));
app.use(express.static(path.join(__dirname,'public')));




module.exports = app;