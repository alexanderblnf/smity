var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var user = require('../app/sql_models/user');

// expose this function to our app using module.exports
module.exports = function (passport, db, pgp) {

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

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {

            if(email == null || password == null) {
                return done(null, false, "You have not provided all necessary information");
            } else {
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
                            return done(null, false, "There is already an e-mail registered");
                        } else {
                            var bcrypt = require('bcrypt');
                            var plainPassword = options.password;
                            bcrypt.hash(plainPassword, 10, function (err, hash) {
                                if (err) {
                                    return done(err);
                                }
                                options.password = hash;
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
                            });
                        }
                    });

                });
            }

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
            if(email == null || password == null) {
                return done(null, false, 'You have not provided all the necessary information');
            }
            var ps = pgp.PreparedStatement;
            var options = {
                ps: ps,
                db: db,
                email: email,
                password: password
            };
            user.findByEmail(options, function (err, data) {
                if (!data) {
                    return done(null, false, "Bad username or password");
                }

                if(err && err.code != 0) {
                    return done(err);
                }

                user.verifyPassword(options, function (valid) {
                    if (valid == false) {
                        return done(null, false, "Bad username or password");
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