var express = require('express');
var router = express.Router();
var elasticFunction = require('./elasticFunction');
var params = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm)';
var params_witall = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm|all)';
var datamodes = '(|array|indexmap)';

// auxiliary function to get means for a certain time
// router.get('/means/:param/:time', function (req, res) {
//     var options = {
//         param: req.params.param,
//         time: req.params.time
//     };
//     elasticFunction.getMeansForTime(options, res);
// });

// Get measurements for all uRAD Sensors for a given parameter and time interval
router.get('/all/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
    var options = {
        param: req.params.param,
        start: req.params.timeStart,
        end: req.params.timeEnd
    };
    var diff = options.end - options.start;
    var maxMeasurementTime = 24000;

    if (diff <= 0) {
        res.status(400).send('End time is before start time');
    } else {
        if (diff <= maxMeasurementTime) {
            elasticFunction.getAllForInterval(options, res);
        } else {
            options.step = Math.ceil(diff / maxMeasurementTime);
            elasticFunction.getIntervalStepsAll(options, res);
        }
    }

});

router.get('/heatmapdata/:param' + params + '/:timeStart/:timeEnd', function (req, res) {
	var options = {
		param: req.params.param,
		start: req.params.timeStart,
		end: req.params.timeEnd
	};

    var diff = options.end - options.start;
    var maxMeasurementTime = 24000;

    if (diff <= 0) {
        res.status(400).send('End time is before start time');
    } else {
        if (diff >= maxMeasurementTime) {
            options.step = Math.ceil(diff / maxMeasurementTime);
        }
        elasticFunction.getDataForHeatmap(options, res);
    }
});

router.get('/:param' + params + '/prediction/:desired', function (req, res) {
    var start = (req.params.desired - 2592000); // - 30 days
    var options = {
        device: req.params.device,
        param: req.params.param,
        desired: req.params.desired,
        start: start,
        end: req.params.desired
    };

    if(options.time < 1483273126) {
        res.status(400).send('No data available for this time');
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
        res.status(400).send('End time is before start time');
    } else {
        var diff = options.end - options.start;
        if (diff <= 432000) {
            elasticFunction.getForInterval(options, res);
        } else {
            options.step = Math.ceil(diff / 432000);
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
        res.status(400).send('Start time must be before end time');
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

router.get('/weekly/:param', function (req, res) {
    var options = {
        param: req.params.param
    };
    elasticFunction.weeklyReport(options, res);
});

router.get('/live', function (req, res) {
    elasticFunction.getLive(res);
});

router.get('/livemeans', function(req, res){
   elasticFunction.getLiveMeans(res);
});


module.exports = router;