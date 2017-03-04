var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var user = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport, db, pgp) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        var ps = pgp.PreparedStatement;
        var options = {
            db: db,
            ps: ps,
            id: id
        };
        user.findById(options, function (err, user) {
            done(null, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            var ps = pgp.PreparedStatement;
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                var options = {
                    ps: ps,
                    db: db,
                    email: email,
                    password: password
                };
                user.findByEmail(options, function (err, data) {
                    if (err) {
                        if(err.code != 0) {
                            return done(err);
                        }
                    }

                    if (data) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        user.addUser(options, function (err1, result) {
                            if(err1) {
                                return done(err);
                            }

                            var newUser = {
                                id: result.id,
                                email: email,
                                password: password
                            };

                            return done(null, newUser)
                        });
                    }
                });

            });

        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            var ps = pgp.PreparedStatement;
            var options = {
                ps: ps,
                db: db,
                email: email,
                password: password
            };
            user.findByEmail(options, function (err, data) {
                if (!data) {
                    return done(null, false, req.flash('loginMessage', 'No user found'));
                }

                if(err && err.code != 0) {
                    return done(err);
                }

                user.verifyPassword(options, function (valid) {
                    if (valid == false) {
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    var newUser = {
                        id: data.id,
                        email: email,
                        password: password
                    };
                    return done(null, newUser);
                });
            });
        }));

};