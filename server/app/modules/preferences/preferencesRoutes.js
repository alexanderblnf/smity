var express = require('express');
var router = express.Router();
var preferencesFunction = require('./preferencesFunction');

module.exports = function (db, pgp) {
    var ps = pgp.PreparedStatement;

    router.get('/get', function (req, res) {
        if (req.user == null) {
            var response = {
                code: 400,
                message: 'You are not logged in'
            };
            res.send(response);
        } else {
            var options = {
                userId: req.user.id,
                db: db,
                ps: ps
            };
            preferencesFunction.getPreferences(options, res);
        }
    });

    router.post('/update', function (req, res) {
        var prefs = req.body.prefs;
        if (prefs == null) {
            var response = {
                code: 400,
                message: 'Bad request'
            };
            res.send(JSON.stringify(response));
        } else {
            if (prefs.constructor === Array) {
                var options = {
                    prefs: prefs,
                    db: db,
                    ps: ps
                };
                preferencesFunction.updatePreferences(options, res);
            } else {
                var response = {
                    code: 400,
                    message: 'Bad request'
                };
                res.send(JSON.stringify(response));
            }
        }

    });
    return router;
};

