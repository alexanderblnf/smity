var express  = require('express');
var app      = express();
var port = process.env.PORT || 80;
var pgp = require('pg-promise')();
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path = require('path');
var configDB = require('./server/config/database.js');

// configuration ===============================================================
var db = pgp(configDB.url); // connect to our database
require('./server/config/passport')(passport, db, pgp); // pass passport for configuration

app.use(express.static(path.join(__dirname, 'web/app')));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
//app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
                    resave: true,
                    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
require('./server/app/routes.js')(app, passport, db, pgp); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);