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

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, message) {
            var permissionLookup = {
                1: 'ADMIN',
                2: 'MANAGER',
                3: 'CITIZEN'
            };
            var response = {};
            if (err) {
                res.status(500).send(err);
            } else {
                if (user == false) {
                    res.status(400).send(message);
                } else {
                    req.login(user, function () {
                        response["firstname"] = user.firstname;
                        response["lastname"] = user.lastname;
                        response["permission"] = permissionLookup[user.permission];
                        res.status(200).send(response);
                    });
                }
            }

        })(req, res, next);
    });

    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, message) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (user == false) {
                    res.status(400).send(message);
                } else {
                    res.status(200).send('OK');
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
     ==========================
     Admin endpoints
     ==========================
     */
    var admin = require('./modules/admin/adminRoutes')(db, pgp);
    app.use('/admin', isLoggedIn, admin);


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
    // var urad = require('./modules/urad/uradRoutes.js');
    // app.use('/urad', urad);

    /*
     =============================
     Endpoints for liveObjects API
     =============================
     */
    // var liveObjects = require('./modules/liveobjects/liveObjectsRoutes');
    // app.use('/live', liveObjects);


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
    var intelilight = require('./modules/intelilight/elasticRoutes');
    app.use('/intelilight', isLoggedIn, intelilight);


    /*
     =============================
     Zoniz beacons api
     =============================
     */

    var beacons = require('./modules/beacons/beaconRoutes');
    app.use('/beacons/', beacons);


    /*
     ==============================
     Preferences API
     ==============================
     */

    var preferences = require('./modules/preferences/preferencesRoutes')(db, pgp);
    app.use('/preferences', isLoggedIn, preferences);


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
    else {
        console.log('Nu e logat');
    }
    // if they aren't redirect them to the home page
    res.sendStatus(401);
}