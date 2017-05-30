var preferences = require('../../sql_models/preference');

exports.getPreferences = function (options, res) {
    preferences.getPreferences(options, function (done, data) {
        if (done == false) {
            var response = {
                code: 400,
                message: data
            };
            res.send(JSON.stringify(response));
        } else {
            var response = {
                code: 200,
                message: data
            };
            res.send(JSON.stringify(response));
        }
    })
};

exports.updatePreferences = function (options, res) {
    preferences.updatePreferences(options, function (done, err) {
        if (done == false) {
            var response = {
                code: 400,
                message: err
            };
            res.send(JSON.stringify(response));
        } else {
            response = {
                code: 200,
                message: "Update successful"
            };
            res.send(JSON.stringify(response));
        }
    })
};
