var http = require('http');

exports.getCampaigns = function (options, res) {
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
            data = data["collection"];
            out.push(JSON.stringify(data));
            out.push(null);
            out.pipe(res);
        });
    });
};

exports.getCampaignUsers = function (options, res) {
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
            out.push(JSON.stringify(data));
            out.push(null);
            out.pipe(res);
        });
    });
};
