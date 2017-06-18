var express = require('express');
var router = express.Router();
var adminFunctions = require('./adminFunctions');

module.exports = function (db, pgp) {
    var ps = pgp.PreparedStatement;
    router.post('/add-manager', function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var firstName = req.body.firstname;
        var lastName = req.body.lastname;
        var userId = req.user.id;
        if (email == null || password == null || firstName == null || lastName == null) {
            res.status(400).send('You have not provided all the information');
        } else {
            var bcrypt = require('bcrypt');
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Server error");
                } else {
                    var options = {
                        email: email,
                        password: hash,
                        firstName: firstName,
                        lastName: lastName,
                        userId: userId,
                        db: db,
                        ps: ps
                    };
                    console.log(options);
                    adminFunctions.addManager(options, function (done, data) {
                        if (done == false) {
                            res.status(400).send(data);
                        } else {
                            res.status(200).send('OK');
                        }
                    });
                }
            });
        }
    });

    router.post('/delete-manager', function (req, res) {
        var email = req.body.email;
        if (email == null || email == '') {
            res.status(400).send('You have not provided all the information')
        } else {
            var options = {
                email: email,
                userId: req.user.id
            };
            adminFunctions.removeManager(options, function (done, data) {
                if (done == false) {
                    res.status(400).send(data);
                } else {
                    res.status(200).send('OK');
                }
            });
        }
    });

    return router;
};