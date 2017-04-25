module.exports = function (app, passport, db, pgp) {
    var express = require('express');
    var path = require('path');
    var jwt = require('jwt-simple');


    app.use(function (req, res, next) {
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

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../web/app/index.html'));
    });

    app.get('/logini', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, message) {
            var response = {};
            if (err) {
                response["code"] = 500;
                response["message"] = err;
                res.send(response);
            } else {
                if(user == false) {
                    response["code"] = 400;
                    response["message"] = message;
                    res.send(response);
                } else {
                    req.login(user, function () {
                        response["code"] = 200;
                        response["message"] = "OK";
                        res.send(response);
                    });
                }
            }

        })(req, res, next);
    });
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // app.get('/signup', function(req, res) {
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });

    // process the signup form
    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, message) {
            var response = {};
            if (err) {
                response["code"] = 500;
                response["message"] = err;
                res.send(response);
            } else {
                if(user == false) {
                    response["code"] = 400;
                    response["message"] = message;
                    res.send(response);
                } else {
                    response["code"] = 200;
                    response["message"] = "OK";
                    res.send(response);
                }
            }

        })(req, res, next);
    });

    app.get('/encode/:password', function (req, res) {
        var bcrypt = require('bcrypt');
        var password = req.params.password;
        bcrypt.hash(password, 10, function (err, hash) {
            res.send(hash);
        });
    });
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/signup',
    //     failureFlash: true
    // }));

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.send('Logged out');
    });

    app.get('/isloggedIn', function (req, res) {
        if (req.isAuthenticated()) {
            res.json(true);
        } else {
            res.json(false);
        }
    });

    /*
     =========================
     Permission endpoints - Smity Admins only
     =========================
     */
    var permission = require('./sql_models/permission');
    app.post('/permission/add', function (req, res) {
        var id = req.body.id;
        var name = req.body.name;
        var description = req.body.description;
        var userId = req.body['user-id'];
        var ps = pgp.PreparedStatement;
        if (id == null || name == null || userId == null) {
            res.send('{message: "Bad request"}');
        } else {
            var options = {
                id: id,
                name: name,
                description: description,
                userId: userId,
                db: db,
                ps: ps
            };
            permission.addPermission(options, function (done, data) {
                var message = {};
                if (done == false) {
                    message["response"] = "fail";
                } else {
                    message["response"] = "success";
                }
                message["message"] = data;
                res.send(message);
            });
        }

    });


    /*
     =========================
     Preferences endpoints
     =========================
     */


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