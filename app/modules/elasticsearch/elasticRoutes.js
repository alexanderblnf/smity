var express = require('express');
var router = express.Router();
var elasticFunction = require('./elasticFunction');
var params = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm)';

router.get('/:device/:param' + params + '/prediction/:time', function (req, res) {
    var options = {
        device: req.params.device,
        param: req.params.param,
        time: req.params.time
    };

    if(options.time < 1483273126) {
        res.send('{"error": "No data available for this time"}');
    } else {
        elasticFunction.hourlyPrediction(options, res);
    }
});

router.get('/:device/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
    var options = {
        device: req.params.device,
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd
    };

    if(options.start > options.end) {
        res.send('{"error": "Start time must be before end time"}');
    } else {
        elasticFunction.getForInterval(options, res);
    }
});
module.exports = router;