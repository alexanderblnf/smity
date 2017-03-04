var http = require('http');
exports.getDaily = function (options, res) {
    http.get(options, function (response) {
        var stream = require('stream');
        var out = new stream.Readable();
        var full = "";
        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            filter(full, out, options.param, options.limit);
            out.push(null);
            out.pipe(res);
        });
    });
};

function filter(dataS, out, param, limit) {
    var data = JSON.parse(dataS);
    var temp;
    data.forEach(function (d, index) {
        if(index == 0) {
            temp = d[param];
            out.push(JSON.stringify(d));
       } else {
           if(d[param] - temp > limit) {
               temp = d[param];
               out.push(JSON.stringify(d));
           }
       }
    });
}