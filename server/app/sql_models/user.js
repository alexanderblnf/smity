exports.addUser = function (options, callback) {
    if (options.email == null || options.password == null) {
        callback("Either e-mail or password is empty");
    } else {
        findByEmail(options, function (err, data) {
            if(data == null) {
                var add = new options.ps('add-user', 'INSERT INTO users(email, password, permission) VALUES($1, $2, 3) returning id',
                    [options.email, options.password]);

                options.db.one(add)
                    .then(function (data) {
                        callback(null, data);
                    })
                    .catch(function (err) {
                        callback(err, null);
                    });
            } else {
                callback("There is an existing account with this e-mail", null);
            }

        });

    }
};

exports.findById = function (options, callback) {
  var find = new options.ps('find-id', 'SELECT * FROM users WHERE id = $1', [options.id]);

  options.db.one(find)
      .then(function (data) {
          callback(null, data);
      })
      .catch(function (err) {
          callback(err, null);
      });
};

exports.verifyPassword = function (options, callback) {
    if (options.email == null || options.password == null) {
        callback(false);
    } else {
        findByEmail(options, function (err, data) {
            if(data == null) {
                callback(false);
            } else {
                var bcrypt = require('bcrypt');
                bcrypt.compare(options.password, data.password, function (err1, res) {
                    if (err1) {
                        console.log("Compare hash error");
                        callback(false);
                    } else {
                        callback(res);
                    }
                });
                /*if(data.password == options.password) {
                    callback(true);
                } else {
                    callback(false);
                }*/
            }

        });

    }
};

function findByEmail(options, callback) {
    var find = new options.ps('find-email', 'SELECT * from users where email = $1', [options.email]);

    options.db.one(find)
        .then(function (data) {
            callback(null, data);
        })
        .catch(function (err) {
            callback(err, null);
        })
}


exports.findByEmail = findByEmail;