var http = require('http');
exports.getData = function (options, res) {
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
            if(data.success == null) {
                filter(data, outJSON, options.param, options.limit);
                out.push(JSON.stringify(outJSON));
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
            filterByCity(data, outJSON, options.city);
            if(options.online != null) {
                var onlineJSON = [];
                filterOnline(outJSON, onlineJSON);
                out.push(JSON.stringify(onlineJSON));
            } else {
                out.push(JSON.stringify(outJSON));
            }
            out.push(null);
            out.pipe(res);
        });
    });
};

function filterByCity(data, out, city) {
    data.forEach(function (d) {
       if(d.city == city) {
           out.push(d);
       }
    });
}

function filterOnline(data, out) {
    var date = new Date();
    var epochTime = date.getTime() / 1000;
    data.forEach(function (d) {
       if(epochTime - d.timelast < 62) {
           out.push(d);
       }
    });
}

function filter(data, out, param, limit) {
    var temp = 0;
    var lasttime = 0;
    data.forEach(function (d, index) {
        if(index == 0) {
            lasttime = d.time;
            temp = d[param];
            out.push(d);
       } else {
            if(Math.abs(d[param] - temp) > limit) {
               temp = d[param];
               lasttime = d.time;
               out.push(d);
            }
       }
    });
}