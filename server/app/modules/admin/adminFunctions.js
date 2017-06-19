var permission = require('../../sql_models/permission');
exports.addManager = function (options, callback) {
    permission.getPermission(options, function (done, data) {
        if (done == false) {
            callback(false, data);
        } else {
            if (data.permission == 1) {
                var add = new options.ps('add-user', 'INSERT INTO users(email, password, firstname, lastname, permission, preferences) ' +
                    'VALUES($1, $2, $3, $4, 2, $5) returning id',
                    [options.email, options.password, options.firstName, options.lastName, [1, 3]]);

                options.db.one(add)
                    .then(function (data) {
                        callback(true, data);
                    })
                    .catch(function (err) {
                        callback(false, err);
                    });
            } else {
                callback(false, "You do not have the required permissions");
            }
        }
    });
};

exports.removeManager = function (options, callback) {
    permission.getPermission(options, function (done, data) {
        if (done == false) {
            callback(false, data);
        } else {
            if (data.permission == 1) {
                var remove = new options.ps('delete-user', 'DELETE FROM users where email = $1', [options.email]);

                options.db.oneOrNone(remove)
                    .then(function (data) {
                        callback(true, data);
                    })
                    .catch(function (err) {
                        callback(false, err);
                    });
            } else {
                callback(false, "You do not have the required permissions");
            }
        }
    });
};