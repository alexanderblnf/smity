var express = require('express');
var router = express.Router();
var inteliHeaders = {
    'x-api-key': '4kVwucqdgF9REo1hp9f0K32TAyq4G8Lk4AFhtmvO'
};
var httpReq = require('./intelilightRequests');

router.get('/controllers', function (req, res) {
    var options = {
        headers: inteliHeaders,
        host: 'api.intelilight.eu',
        path: '/orange/controllers',
        method: 'GET'
    };

    httpReq.getControllers(options, res);
});

router.get('/controllers/:controller', function (req, res) {
    var controller = req.params.controller;
    var options = {
        headers: inteliHeaders,
        host: 'api.intelilight.eu',
        path: '/orange/controllers/' + controller,
        method: 'GET'
    };

    httpReq.getController(options, res);
});

module.exports = router;