var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'http://141.85.232.64:9200'
});
var params = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm)';

router.get('/:device/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
    var device = req.params.device;
    var start = req.params.timeStart;
    var end = req.params.timeEnd;

    if(start > end) {
        res.send('{error: "Start time must be before end time"}');
    }

    var param = req.params.param;
    client.search({
        index: device,
        type: param,
        from: 0,
        size: 50,
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
        var out = [];
        resp.hits.hits.forEach(function (d) {
            out.push(d["_source"]);
        });
        res.send(out);
    }, function (err) {
        console.log(err.message);
    })
});

module.exports = router;