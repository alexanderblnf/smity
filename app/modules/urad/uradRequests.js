var http = require('http');
var func = require('./uradFunctions');
exports.getData = function (options, res) {
    http.get(options, function (response) {
        console.log(res.statusCode);

        var stream = require('stream');
        var out = new stream.Readable();
        var outJSON = [];
        var full = "";
        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            var data = JSON.parse(full);
            if (data.success == null && data.error == null) {
                func.filter(data, outJSON, options.param, options.limit);
                out.push(JSON.stringify(outJSON));
                out.push(null);
            } else if(data.error != null) {
                out.push(JSON.stringify(data));
                out.push(null);
            } else {
                out.push('{"error":"Sensor is offline"}');
                out.push(null);
            }
            out.pipe(res);
        });
    });
};

exports.getDevices = function (options, res) {
    http.get(options, function (response) {
        var stream = require('stream');
        var out = new stream.Readable();
        var outJSON = [];
        var full = "";

        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            var data = JSON.parse(full);
            func.filterByCity(data, outJSON, options.city);
            if (options.online != null) {
                var onlineJSON = [];
                func.filterOnline(outJSON, onlineJSON);
                out.push(JSON.stringify(onlineJSON));
            } else {
                out.push(JSON.stringify(outJSON));
            }
            out.push(null);
            out.pipe(res);
        });
    });
};

exports.getAverages = function (options, res) {
    http.get(options, function (response) {
        var stream = require('stream');
        var out = new stream.Readable();
        var outJSON = [];
        var full = "";

        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            var data = JSON.parse(full);
            if(options.device != null) {
                outJSON = func.filterDeviceAverages(options.device, data);
            } else {
                outJSON = func.filterAverages(data);
            }
            out.push(JSON.stringify(outJSON));
            out.push(null);
            out.pipe(res);
        });
    });
};

