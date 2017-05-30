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
        var response = {};
        if (email == null || password == null || firstName == null || lastName == null) {
            response["code"] = 400;
            response["message"] = "You have not provided all the information";
            res.send(response);
        } else {
            var bcrypt = require('bcrypt');
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    response["code"] = 500;
                    response["message"] = err;
                    res.send(response);
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
                            response["code"] = 400;
                            response["message"] = data;
                            res.send(response);
                        } else {
                            response["code"] = 200;
                            response["message"] = "OK";
                            res.send(response);
                        }
                    });
                }
            });
        }
    });

    return router;
};