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

exports.getLive = function (options, res) {
    var params = ['temperature', 'humidity', 'pressure', 'voc', 'co2', 'ch2o', 'pm25', 'cpm'];
    var data = {};
    asyncLoop({
        params: params,
        index: 0,
        length: params.length - 1,
        options: options,
        data: data,
        functionToLoop: function (loop, options, param, data) {
            getData(loop, options, param, data);
        },
        callback: function () {
            var stream = require('stream');
            var out = new stream.Readable();
            res.send(JSON.stringify(data));
        }
    })
};

var asyncLoop = function (o) {
    var loop = function () {
        if (o.index == o.length) {
            o.callback();
        } else {
            o.functionToLoop(loop, o.options, o.params[o.index], o.data);
            o.index ++;
        }
    };
    loop();
};

function getData(loop, options, param, out) {
    var aux = options;
    aux.path = '/api/v1/devices/82000035/' + param + '/60';

    http.get(aux, function (response) {

        var full = "";

        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            var data = JSON.parse(full);
            out[param] = data[0][param];
            loop();
        });
    });
}

