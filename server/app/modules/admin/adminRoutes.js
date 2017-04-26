var express = require('express');
var router = express.Router();
var adminFunctions = require('./adminFunctions');

router.post('add-manager', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var response =  {};
    if(email == null || password == null || firstName == null || lastName == null) {
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
                    lastName: lastName
                };
                adminFunctions.addManager(options, function (done, data) {
                    if(done == false){
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