module.exports = function(app, passport, db, pgp) {
    var user = require('./models/user.js');
    var ps = pgp.PreparedStatement;
    var headers = {
        'Content-Type' : 'application/json',
        'X-User-id' : '494',
        'X-User-hash' : '0abd4356b71d9b36d741c592e66080f5'
    };
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
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

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/:device/temp/:interval', function (req, res) {
        var httpreq = require('./requests');
        var device = req.params.device;
        var interval = req.params.interval;
        var options = {
            headers: headers,
            host: 'data.uradmonitor.com',
            path: '/api/v1/devices/' + device + '/temperature/' + interval,
            method: 'GET',
            param: 'temperature',
            limit: 0.2
        };
        httpreq.getDaily(options, res);

    });

    app.get('/:device/pressure/:interval', function (req, res) {
        var httpreq = require('./requests');
        var device = req.params.device;
        var interval = req.params.interval;
        var options = {
            headers: headers,
            host: 'data.uradmonitor.com',
            path: '/api/v1/devices/' + device + '/pressure/' + interval,
            method: 'GET',
            param: 'pressure',
            limit: 10
        };
        httpreq.getDaily(options, res);
    });

    app.get('/:device/humidity/:interval', function (req, res) {
        var httpreq = require('./requests');
        var device = req.params.device;
        var interval = req.params.interval;
        var options = {
            headers: headers,
            host: 'data.uradmonitor.com',
            path: '/api/v1/devices/' + device + '/humidity/' + interval,
            method: 'GET',
            param: 'humidity',
            limit: 2
        };
        httpreq.getDaily(options, res);
    });

    app.get('/:device/voc/:interval', function (req, res) {
        var httpreq = require('./requests');
        var device = req.params.device;
        var interval = req.params.interval;
        var options = {
            headers: headers,
            host: 'data.uradmonitor.com',
            path: '/api/v1/devices/' + device + '/voc/' + interval,
            method: 'GET',
            param: 'voc',
            limit: 100
        };
        httpreq.getDaily(options, res);
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    console.log("ISLOG: " + req.stringify);
    console.log("ISLOG1: " + req.session);
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}