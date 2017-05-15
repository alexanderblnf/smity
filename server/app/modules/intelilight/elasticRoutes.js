var express = require('express');
var router = express.Router();
var elasticFunction = require('./elasticFunctions');

router.get('/controllers', function (req, res) {
    elasticFunction.getControllers(res);
});

router.get('/controllers/latest', function (req, res) {
    var controller = req.params.controller;
    elasticFunction.getLatest(controller, res);
});

router.get('/position/', function (req, res) {
    elasticFunction.getPosition(res);
});

router.get('/historic/all/:startTime/:endTime', function (req, res) {
    var options = {
        controller: req.params.controller,
        start: req.params.startTime,
        end: req.params.endTime
    };
    elasticFunction.getHistoricDataForAll(options, res);
});

router.get('/historic/:controller/:startTime/:endTime', function (req, res) {
    var options = {
        controller: req.params.controller,
        start: req.params.startTime,
        end: req.params.endTime
    };
    elasticFunction.getHistoricData(options, res);
});


module.exports = router;
