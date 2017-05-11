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

module.exports = router;
