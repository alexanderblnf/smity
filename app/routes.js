module.exports = function(app, passport) {
    var express = require('express');
    var path = require('path');

    /*app.use(express.static(path.join(__dirname, '../dash')));
    app.get('/dash', function (req, res) {
       //res.send('Nu va mai basiti');
        res.sendFile(path.join(__dirname, '../dash/index.html'));
    });*/
    app.get('/', isLoggedIn, function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
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
        res.redirect('/');
    });

    /*
    =========================
    Endpoints for urad API
    =========================
     */
    var urad = require('./uradRoutes.js');
    app.use('/urad', urad);

    var liveObjects = require('./liveObjectsRoutes');
    app.use('/live', liveObjects);
    const http = require('http');
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

    /*
    This is a websocket for acessing the server from the Internet
     */
    server.listen(50001, function listening() {
        console.log('Listening socket on port ', server.address().port);
    });




};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}