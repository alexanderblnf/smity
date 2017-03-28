var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'http://141.85.232.64:9200'
});
var array = require('node-array-module');
var regression = require('regression');

exports.getForInterval = function (options, res) {
    client.search({
        index: options.device,
        type: options.param,
        from: 0,
        size: 50,
        body: {
            query: {
                range: {
                    time: {
                        from: options.start,
                        to: options.end
                    }
                }
            },
            sort: [{
                time: {
                    order: 'asc'
                }
            }]
        }
    }).then(function (resp) {
        var out = [];
        resp.hits.hits.forEach(function (d) {
            out.push(d["_source"]);
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};

exports.hourlyPrediction = function (options, res) {
    var data = [];
    var originalTime = options.time;
    asyncLoop({
        time: options.time,
        day: 3600 * 24,
        options: options,
        functionToLoop: function (loop, options, time) {
            //setTimeout(function () {
            getDocs(options, time, data, loop);
            //}, 500);
        },
        callback: function () {
            makeRegression(originalTime, data, res);
        }
    })
};

exports.getIntervalSteps = function (options, res) {
    var interval = 180;
    var intervals = [];

    console.log(options.start + ' ' + options.end + ' ' + options.step);
    var start = Number(options.start);
    var end = Number(options.end);
    for (var i = start; i <= end; i += interval * options.step) {
        if (i >= options.end) {
            break;
        }
        var temp = {
            range: {
                time: {
                    from: i,
                    to: i + interval
                }
            }
        };
        intervals.push(temp);
    }


    client.search({
        index: options.device,
        type: options.param,
        size: 50,

        body: {
            query: {
                bool: {
                    should: intervals
                }
            },
            sort: [{
                time: {
                    order: 'asc'
                }
            }]
        }
    }).then(function (resp) {
        var out = [];
        resp.hits.hits.forEach(function (d) {
            out.push(d["_source"]);
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};

function getDocs(options, time, data, loop) {
    var interval = 15 * 60;
    var start = time - interval;
    var end = time + interval;
    client.search({
        index: options.device,
        type: options.param,
        from: 0,
        size: 11,
        body: {
            query: {
                range: {
                    time: {
                        from: start,
                        to: end
                    }
                }
            },
            sort: [{
                time: {
                    order: 'asc'
                }
            }]
        }
    }).then(function (resp) {
        if (resp.hits.hits.length == 0) {
            loop(1);
        } else {
            var out = [];
            resp.hits.hits.forEach(function (d) {
                out.push(d["_source"][options.param]);
            });
            data.push(array.arrayAverage(out));
            loop(0);
        }
    }, function (err) {
        console.log(err.message);
        loop(0);
    });

}

var asyncLoop = function (o) {
    var loop = function (stop) {
        o.time -= o.day;
        if (stop) {
            o.callback();
            return;
        }
        o.functionToLoop(loop, o.options, o.time);
    };
    loop();
};

function makeRegression(time, data, res) {
    var regressionData = [];
    var length = data.length - 1;
    if (length <= 2) {
        res.send('{"error": "Not enough data"}');
    } else {
        data.forEach(function (val, index) {
            var temp = [];
            temp.push(length - index);
            temp.push(val);
            regressionData.push(temp);
        });
        var reg = regression('linear', regressionData);
        var result = {
            time: time,
            result: reg.equation[1]
        };
        res.send(JSON.stringify(result));
    }
}