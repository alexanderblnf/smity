var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'search-intelilight-uggn2sjhbfw2y2wgey4rrgvf44.us-west-2.es.amazonaws.com'
});

exports.getControllers = function (res) {
    getControllers(function (arr) {
        res.send(JSON.stringify(arr));
    });
};

exports.getLatest = function (controller, res) {
    getControllers(function (arr) {
        client.search({
            size: 22 * (arr.length - 1),
            body: {
                sort: [{
                    time: {
                        order: 'desc',
                        unmapped_type: 'long'
                    }
                }]
            }
        }).then(function (result) {
            var out = [];
            var aux = result.hits.hits;
            var length = aux.length;
            var i = 0;
            while (i < length - 1) {
                var entry = {};
                var first = aux[i]["_index"];
                entry["controller"] = first;
                entry["time"] = aux[i]["_id"];
                while (aux[i]["_index"] == first) {
                    var type = aux[i]["_type"];
                    entry[type] = aux[i]["_source"][type];
                    i++;

                    if (i == length) {
                        break;
                    }
                }
                out.push(entry);
            }
            res.send(out);
        });
    });

};

exports.getPosition = function (res) {
    getControllers(function (arr) {
        client.search({
            size: arr.length - 1,
            type: "gps",
            body: {
                sort: [{
                    time: {
                        order: 'desc',
                        unmapped_type: 'long'
                    }
                }]
            }
        }).then(function (result) {
            var out = [];
            var controllers = [];
            result.hits.hits.forEach(function (d) {
                if (controllers.indexOf(d["_index"]) == -1) {
                    var temp = {
                        controller: d["_index"],
                        lat: d["_source"]["gps"]["lat"],
                        lon: d["_source"]["gps"]["lon"]
                    };
                    out.push(temp);
                }

            });
            res.send(out);
        });
    });
};

function getControllers(callback) {
    client.cat.indices({
        h: ['index']
    }).then(function (result) {
        var arr = result.split('\n');
        arr.splice(-1, 1);
        callback(arr);
    });
}

