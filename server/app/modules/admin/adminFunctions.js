var permission = require('../../sql_models/permission');
exports.addManager = function (options, callback) {
    permission.getPermission(options, function (done, data) {
        if(done == false){
            callback(false, data);
        } else {
            if(data.permission == 1) {
                var add = new options.ps('add-user', 'INSERT INTO users(email, password, firstname, lastname, permission) ' +
                    'VALUES($1, $2, $3, $4, 2) returning id',
                    [options.email, options.password, options.firstName, options.lastName]);

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