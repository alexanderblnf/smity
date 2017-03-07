var http = require('follow-redirects').http;
exports.getData = function (options, res) {
    http.get(options, function (response) {
        var stream = require('stream');
        var out = new stream.Readable();
        var full = "";
        response.on('data', function (data) {
            full += data;
        });

        response.on('end', function () {
            out.push(full);
            out.push(null);
            out.pipe(res);
        });
    });
};
