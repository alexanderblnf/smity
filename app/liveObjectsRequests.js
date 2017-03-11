var http = require('follow-redirects').http;
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
            filterReq(data, outJSON);
            out.push(JSON.stringify(outJSON, null, 4));
            out.push(null);
            out.pipe(res);
        });
    });
};

function filterReq(data, out) {
    data.forEach(function (d) {
       var temp = {
           streamId: d.streamId,
           location: d.location,
           time: d.timestamp,
           value: d.value
       };
       out.push(temp);
    });
}
