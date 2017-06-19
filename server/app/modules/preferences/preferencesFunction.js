var preferences = require('../../sql_models/preference');

exports.getPreferences = function (options, res) {
    preferences.getPreferences(options, function (done, data) {
        if (done == false) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

exports.updatePreferences = function (options, res) {
    preferences.updatePreferences(options, function (done, err) {
        if (done == false) {
            res.status(400).send(err);
        } else {
            res.status(200).send('Update successful');
        }
    })
};
