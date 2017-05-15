var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'http://141.85.232.64:9200'
});
var array = require('node-array-module');
var regression = require('regression');

exports.getAllForInterval = function (options, res) {
    var entries = Math.floor(((options.end - options.start) * 15) / 180);
    client.search({
        type: options.param,
        from: 0,
        size: entries,
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
        var out = {};
        resp.hits.hits.forEach(function (d) {
            if(out[d["_index"]] != null) {
                out[d["_index"]].push(d["_source"]);
            } else {
                out[d["_index"]] = [];
                out[d["_index"]].push(d["_source"]);
            }
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};

exports.getDataForHeatmap = function (options, res) {
    client.search({
        type: options.param,
        from: 0,
        size: 12 * 50,
        body: {
//             aggs: {
//                 by_email: {
//                     terms: {
//             field: "_index",
//             size: 10
//     },
//     aggs: {
//         by_top_hit: { top_hits: { size: 15 } }
//     }
// }
// },
            query: {
                bool: {
                    must: {
                        range: {
                            time: {
                                from: options.start,
                                to: options.end
                            }
                        }
                    },
                    must_not: {
                        bool: {
                            must: {
                                range: {
                                    lat: {
                                        from: 46.081621,
                                        to: 46.083281
                                    }
                                },
                                range: {
                                    long: {
                                        from: 23.574164,
                                        to: 23.576459
                                    }
                                }
                            }
                        }
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
            // if(out[d["_index"]] != null) {
            //     out[d["_index"]].push(d["_source"]);
            // } else {
            //     out[d["_index"]] = [];
            //     out[d["_index"]].push(d["_source"]);
            // }
            out.push(d["_source"]);
            //out.push(d);
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};

exports.getForInterval = function (options, res) {
    var entries = Math.floor((options.end - options.start) / 180);
    client.search({
        index: options.device,
        type: options.param,
        from: 0,
        size: entries,
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

exports.getLive = function (res) {
    client.search({
        index: 82000035,
        from: 0,
        size: 8,
        body: {
            sort: [{
                time: {
                    order: 'desc'
                }
            }]
        }
    }).then(function (resp) {
        var out = {};
        resp.hits.hits.forEach(function (d) {
            var keys = Object.keys(d["_source"]);
            var key = keys[3];
            out[key] = d["_source"][key];
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};

exports.getLiveMeans = function (res) {
    client.search({
        size: 200,
        body: {
            query: {
                range: {
                    time: {
                        from: ( Math.round((new Date()).getTime() / 1000) ) - 60 * 4
                    }
                }
            },
            sort: [{
                time: {
                    order: 'desc'
                }
            }]
        }
    }).then(function (resp) {
        var all = {};
        resp.hits.hits.forEach(function (d) {
            var keys = Object.keys(d["_source"]);
            var key = keys[3];
            var id = d["_index"];
            var val = d["_source"][key];
            if (!all.hasOwnProperty(id))
                all[id] = {};
            if (!all[id].hasOwnProperty(key))
                all[id][key] = val;
        });
        var params = ['temperature', 'humidity', 'pressure', 'voc', 'co2', 'ch2o', 'pm25', 'cpm'];
        var indexes = ['82000039', '82000034', '82000056', '82000035', '8200003f', '82000038', '8200003d', '8200003c', '8200003a', '82000036', '82000057', '8200003e', '8200003b', '82000037', '82000058'];
        var means = {};
        var count = {};
        var dispersion = {};
        var correctedmeans = {};
        var correctedcount = {};

        //initialization
        params.forEach(function (param) {
            means[param] = 0;
            count[param] = 0;
            dispersion[param] = 0;
            correctedcount[param] = 0;
            correctedmeans[param] = 0;
        });

        //compute sum and count
        indexes.forEach(function (index) {
            if (all.hasOwnProperty(index)) {
                var sensor = all[index];
                params.forEach(function (param) {
                    if (sensor.hasOwnProperty(param) && sensor[param] != 0) {
                        means[param] += sensor[param];
                        count[param]++;
                    }
                });
            }
        });

        //compute mean
        params.forEach(function (param) {
            means[param] = 1.0 * means[param] / count[param];
        });

        //compute dispersion sum
        indexes.forEach(function (index) {
            if (all.hasOwnProperty(index)) {
                var sensor = all[index];
                params.forEach(function (param) {
                    if (sensor.hasOwnProperty(param) && sensor[param] != 0) {
                        dispersion[param] += Math.pow((sensor[param] - means[param]), 2);
                    }
                });
            }
        });

        //compute dispersion
        params.forEach(function (param) {
            dispersion[param] = Math.sqrt(1.0 * dispersion[param] / count[param]);
        });

        //compute corrected sums and count
        indexes.forEach(function (index) {
            if (all.hasOwnProperty(index)) {
                var sensor = all[index];
                params.forEach(function (param) {
                    if (sensor.hasOwnProperty(param) && sensor[param] != 0) {
                        if (Math.abs(sensor[param] - means[param]) < dispersion[param]) {
                            correctedmeans[param] += sensor[param];
                            correctedcount[param]++;
                        }
                    }
                });
            }
        });

        //compute corrected final mean
        params.forEach(function (param) {
            if (correctedmeans[param] != 0) {
                correctedmeans[param] = Math.round(1.0 * correctedmeans[param] / correctedcount[param] * 1000) / 1000;
            }

        });

        res.send(correctedmeans);
    }, function (err) {
        console.log(err.message);
    })
};


exports.hourlyPrediction = function (options, res) {
    var intervals = [];
    makePredictionSteps(options, intervals);

    client.search({
        index: ['82000039', '8200003c', '8200003a', '8200003b', '8200003e', '82000036'],
        type: options.param,
        size: 150 * 6,

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
        var sensors = {};
        resp.hits.hits.forEach(function (d) {
            if (sensors[d["_index"]] == null) {
                sensors[d["_index"]] = [];
            }
            sensors[d["_index"]].push(d["_source"]);
        });
        var keys = Object.keys(sensors);
        var result = [];
        keys.forEach(function (key) {
            result.push(makeRegression(options.desired, sensors[key], options.param));
        });
        var val = normalize(result);

        var prediction = {
            time: result[0].time,
            // result: sum / result.length
            result: val
        };
        res.send(prediction);

    }, function (err) {
        console.log(err.message);
    })
};

exports.getIntervalSteps = function (options, res) {
    var intervals = [];

    makeSteppedInterval(options, intervals);

    client.search({
        index: options.device,
        type: options.param,
        size: 200,

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


exports.getGeneric = function (options, res) {

    var intervals = [];
    if (options.step != 1)
        makeSteppedInterval(options, intervals);

    var exclusion_list = [];
    if (options.exclusion !== "none") {
        var exclusion_json = JSON.parse(options.exclusion);
        exclusion_json.forEach(function (item) {
            var tempexcl = {
                bool: {
                    must: {
                        range: {
                            lat: {
                                from: item.lat1,
                                to: item.lat2
                            }
                        },
                        range: {
                            long: {
                                from: item.lng1,
                                to: item.lng2
                            }
                        }
                    }
                }
            };
            exclusion_list.push(tempexcl);
        });
    }

    console.log(options.hourStart);

    var hourscript = {
        script: {
            script: {
                inline: "( (doc['time'].value/60)%1440 > (" + options.hourStart*60 + ") ) & ( (doc['time'].value/60)%1440 < (" + options.hourEnd*60 + ") )",
                //inline: "doc['time'].date.hourOfDay > 12",
                lang: "expression"
            }
        }
    };

    var query = {
        size: options.size,
        body: {
            query: {
                bool: {
                    must_not: exclusion_list,
                    must: [
                        hourscript,
                        {
                            bool: {
                                should: intervals
                            }
                        }
                    ]
                }
            },
            sort: [{
                time: {
                    order: 'asc'
                }
            }]
        }
    };

    //set device or get from all
    if (options.device !== "all")
        query.index = options.device;

    //set parameter or get all
    if (options.param !== "all")
        query.type = options.param;

    client.search(query).then(function (resp) {
        var out = [];

        resp.hits.hits.forEach(function (d) {
            out.push(d["_source"]);
        });

        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};


exports.getIntervalStepsAll = function(options, res) {
    var intervals = [];
    var entries = Math.floor(((options.end - options.start) * 15) / (options.step * 180));
    makeSteppedInterval(options, intervals);

    client.search({
        type: options.param,
        from: 0,
        size: entries,

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
        var out = {};
        resp.hits.hits.forEach(function (d) {
            if (out[d["_index"]] != null) {
                out[d["_index"]].push(d["_source"]);
            } else {
                out[d["_index"]] = [];
                out[d["_index"]].push(d["_source"]);
            }
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
};

function makePredictionSteps(options, intervals) {
    var start = Number(options.start);
    var end = Number(options.end);
    var day = 24 * 3600;
    var interval = 5 * 180;
    for (var i = start; i <= end; i += day) {
        if (i >= options.end) {
            break;
        }
        var temp = {
            range: {
                time: {
                    from: i - interval,
                    to: i + interval
                }
            }
        };
        intervals.push(temp);
    }
}

function makeSteppedInterval(options, intervals) {
    var interval = 180;
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
}


function makeRegression(time, data, param) {
    var regressionData = [];
    var length = data.length - 1;
    if (length <= 2) {
        res.send('{"error": "Not enough data"}');
    } else {
        data.forEach(function (val, index) {
            var temp = [];
            temp.push(index);
            temp.push(val[param]);
            regressionData.push(temp);
        });
        var reg = regression('linear', regressionData);
        var result = {
            time: time,
            result: reg.equation[1]
        };
        return result;
    }
}

function normalize(results) {
    var sum = 0;
    results.forEach(function (d) {
        sum += d.result;
    });

    sum = sum / results.length;

    var dispersion = 0;

    results.forEach(function (d) {
        dispersion += Math.pow((d.result - sum), 2);
    });

    dispersion = Math.sqrt(dispersion / results.length);

    var correctedCount = 0;
    var correctedMeans = 0;

    results.forEach(function (d) {
        if (Math.abs(d.result - sum) < dispersion) {
            correctedMeans += d.result;
            correctedCount++;
        }
    });

    correctedMeans = Math.round(correctedMeans / correctedCount * 1000) / 1000;

    return correctedMeans;
}