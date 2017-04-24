module.exports = function(app, passport) {
    var express = require('express');
    var path = require('path');
    var jwt = require('jwt-simple');


    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        if ('OPTIONS' == req.method) {
            res.sendStatus(204);
        } else {
            next();
        }
    });

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../web/app/index.html'));
    });

    app.get('/logini', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', function(req, res, next ){
        passport.authenticate('local-login', function(err, user) {
            if (err) {
                return res.json(err)
            }

            if (!user) {
                res.sendStatus(401);
            }

            req.login(user, function() {
                var token = jwt.encode(user.email, 'secretinismitini');
                res.json(token);
            });

        })(req, res, next);
    });
    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.send('Logged out');
    });

    app.get('/isloggedIn', function (req, res) {
       if(req.isAuthenticated()) {
           res.json(true);
       } else {
           res.json(false);
       }
    });

    /*
    =========================
    Email service
    =========================
     */
    var email = require('./modules/email/email');
    app.use('/email', email);

    /*
    =========================
    Endpoints for urad API
    =========================
     */
    var urad = require('./modules/urad/uradRoutes.js');
    app.use('/urad', urad);

    /*
    =============================
    Endpoints for liveObjects API
    =============================
     */
    var liveObjects = require('./modules/liveobjects/liveObjectsRoutes');
    app.use('/live', liveObjects);


    /*
    ============================
    Elastic search endpoints
    ============================
     */
    var elastic = require('./modules/elasticsearch/elasticRoutes');
    app.use('/elastic', elastic);


    /*
    ============================
    Intelilight API
    ============================
     */
    var intelilight = require('./modules/intelilight/intelilightRoutes');
    app.use('/intelilight', intelilight);

    /*
        Websocket for accessing the platform from the internet
     */
    /*const http = require('http');
    const url = require('url');
    const server = http.createServer(app);
    var socket = require('ws');
    const wss = new socket.Server({server});

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log(message);
        });

        ws.send('OK');
    });

    server.listen(50001, function listening() {
        console.log('Listening socket on port ', server.address().port);
    });*/




};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    console.log(req._passport);
    if (req.isAuthenticated())
        return next();
    else {
        console.log('Nu e logat');
    }
    // if they aren't redirect them to the home page
    res.redirect('/login');
}