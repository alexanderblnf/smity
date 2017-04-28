exports.addPermission = function (options, callback) {
    if (options.id == null || options.name == null || options.userId == null) {
        callback(false, "You have not provided the necessary information");
    } else {
        findPermission(options, function (done, data) {
            if (done == false) {
                callback(false, data);
            } else {
                if (data.permission == 1) {
                    var add;
                    if (options.description != null) {
                        add = new options.ps('add-permission', 'INSERT INTO permission VALUES($1, $2, $3) RETURNING name',
                            [options.id, options.name, options.description]);
                    } else {
                        add = new options.ps('add-permission', 'INSERT INTO permission(id, name) VALUES($1, $2) RETURNING name',
                            [options.id, options.name]);
                    }

                    options.db.one(add)
                        .then(function (permission) {
                            callback(true, permission);
                        })
                        .catch(function (err) {
                            callback(false, err);
                        });
                } else {
                    callback(false, "You do not have the necessary permission to do this");
                }
            }
        });

    }
};

exports.getPermission = findPermission;

function findPermission(options, callback) {
    if (options.userId == null) {
        callback(false, "You have not provided the necessary information");
    } else {
        var find = new options.ps('find-permission', 'SELECT permission FROM users where id = $1', [options.userId]);
        options.db.one(find)
            .then(function (data) {
                callback(true, data);
            })
            .catch(function (err) {
                callback(false, err);
            });
    }
}
