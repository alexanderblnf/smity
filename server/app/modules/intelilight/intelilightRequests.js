var http = require('follow-redirects').https;

exports.getControllers = function (options, res) {
    http.get(options, function (response) {
        var full = "";
        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            res.send(full);
        });
    });
};

exports.getController = function (options, res) {
    http.get(options, function (response) {
        var full = "";
        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            res.send(full);
        });
    });
};