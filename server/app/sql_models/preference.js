// exports.updatePreference = function (options, callback) {
//     if (options.id == null || options.name == null || options.userId == null) {
//         callback(false, "You have not provided the necessary information");
//     } else {
//         findPermission(options, function (done, data) {
//             if (done == false) {
//                 callback(false, data);
//             } else {
//                 if (data.permission == 1) {
//                     var add;
//                     if (options.description != null) {
//                         add = new options.ps('add-permission', 'INSERT INTO permission VALUES($1, $2, $3) RETURNING name',
//                             [options.id, options.name, options.description]);
//                     } else {
//                         add = new options.ps('add-permission', 'INSERT INTO permission(id, name) VALUES($1, $2) RETURNING name',
//                             [options.id, options.name]);
//                     }
//
//                     options.db.one(add)
//                         .then(function (permission) {
//                             callback(true, permission);
//                         })
//                         .catch(function (err) {
//                             callback(false, err);
//                         });
//                 } else {
//                     callback(false, "You do not have the necessary permission to do this");
//                 }
//             }
//         });
//
//     }
// };

exports.updatePreferences = function (options, callback) {
    getPreferencesList(options, function (done, data) {
        if (done == false) {
            callback(done, data);
        } else {
            var auxPrefs = {};
            data.forEach(function (preference) {
                auxPrefs[preference.parameter] = preference.id;
            });

            var preferences = [];
            options.prefs.forEach(function (preference) {
                preferences.push(auxPrefs[preference]);
            });
            options.preferences = preferences;
            updateUserPreference(options, function (done, err) {
                if (done == false) {
                    callback(done, err);
                } else {
                    callback(done);
                }
            });

        }
    });
};

exports.getPreferences = function (options, callback) {
    getPreferencesList(options, function (done, data) {
        if (done == false) {
            callback(done, data);
        } else {
            var preferences = {};
            data.forEach(function (preference) {
                preferences[preference.id] = preference.parameter;
            });
            getUserPreferences(options, function (userDone, userData) {
                if (userDone == false) {
                    callback(userDone, userData);
                } else {
                    if (userData == null) {
                        callback(userDone, []);
                    } else {
                        var userPreferences = [];
                        var data = userData.preferences;
                        data.forEach(function (value) {
                            userPreferences.push(preferences[value]);
                        });
                        callback(userDone, userPreferences);
                    }
                }
            });
        }
    })
};


function getPreferencesList(options, callback) {
    var find = new options.ps('find-preferences', 'SELECT * FROM preferences');
    options.db.manyOrNone(find)
        .then(function (data) {
            callback(true, data);
        })
        .catch(function (err) {
            callback(false, err);
        });
}

function getUserPreferences(options, callback) {
    var find = new options.ps('find-user-preferences', 'SELECT preferences FROM users where id=$1', [options.userId]);
    options.db.oneOrNone(find)
        .then(function (data) {
            callback(true, data);
        })
        .catch(function (err) {
            callback(false, err);
        })
}

function updateUserPreference(options, callback) {
    var update = new options.ps('update-user-preferences', 'UPDATE users SET preferences = $1', [options.preferences]);
    options.db.none(update)
        .then(function (data) {
            callback(true);
        })
        .catch(function (err) {
            callback(false, err);
        });
}
