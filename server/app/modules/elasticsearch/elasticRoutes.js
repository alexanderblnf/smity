var express = require('express');
var router = express.Router();
var elasticFunction = require('./elasticFunction');
var params = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm)';

router.get('/all/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
    var options = {
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd
    };

    elasticFunction.getAllForInterval(options, res);
});

router.get('/all-onstreets/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
    var options = {
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd
    };

    elasticFunction.getAllForIntervalOnStreet(options, res);
});

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
    console.log('First');
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

router.get('/:device/:param' + params + '/:timeStart/:timeEnd/:step', function (req, res) {
    var options = {
        device: req.params.device,
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd,
        step: req.params.step
    };

    if(options.start > options.end) {
        res.send('{"error": "Start time must be before end time"}');
    } else {
        if (options.step < 0) {
            res.send('{"error" : "Step must be positive"}');
        }
        elasticFunction.getIntervalSteps(options, res);
    }
});

router.get('/live', function (req, res) {
    elasticFunction.getLive(res);
});

router.get('/livemeans', function(req, res){
   elasticFunction.getLiveMeans(res);
});




module.exports = router;