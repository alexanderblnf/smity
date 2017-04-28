var express = require('express');
var router = express.Router();
var elasticFunction = require('./elasticFunction');
var params = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm)';
var params_witall = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm|all)';
var datamodes = '(|array|indexmap)';

router.get('/all/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
    var options = {
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd
    };
    var diff = options.end - options.start;
    if (diff <= 24000) {
        elasticFunction.getAllForInterval(options, res);
    } else {
        options.step = Math.ceil(diff / 24000);
        elasticFunction.getIntervalStepsAll(options, res);
    }
});

router.get('/heatmapdata/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
	var options = {
		param: req.params.param,
		start: req.params.timeStart,
		end: req.params.timeEnd
	};

	elasticFunction.getDataForHeatmap(options, res);
});

router.get('/:device/:param' + params + '/prediction/:desired', function (req, res) {
    var desired = new Date(req.params.desired * 1000);
    var hours = Number(desired.getHours()), minutes = Number(desired.getMinutes());
    var date = new Date();
    var now = Math.floor(date.getTime() / 1000);
    var start = (req.params.desired - 2592000) + (hours * 3600 + minutes * 60);
    var options = {
        device: req.params.device,
        param: req.params.param,
        desired: req.params.desired,
        start: start,
        end: now
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
        var diff = options.end - options.start;
        if (diff <= 90000) {
            elasticFunction.getForInterval(options, res);
        } else {
            options.step = Math.ceil(diff / 90000);
            elasticFunction.getIntervalSteps(options, res);
        }

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

router.get('/generic/:device/:param' + params_witall + '/:exclusion/:hourStart/:hourEnd/:timeStart/:timeEnd/:step/:size', function (req, res) {
    /* TODO change to POST */

    var options = {
        datamode: req.params.datamode,
        device: req.params.device,
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd,
        step: req.params.step,
        exclusion: req.params.exclusion,
        size: req.params.size,
        hourStart: req.params.hourStart,
        hourEnd: req.params.hourEnd
    };

    elasticFunction.getGeneric(options, res);
});

router.get('/live', function (req, res) {
    elasticFunction.getLive(res);
});

router.get('/livemeans', function(req, res){
   elasticFunction.getLiveMeans(res);
});


module.exports = router;