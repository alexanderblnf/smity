var express = require('express');
var router = express.Router();
var uradHeaders = {
    'Content-Type': 'application/json',
    'X-User-id': '494',
    'X-User-hash': '0abd4356b71d9b36d741c592e66080f5'
};
var httpreq = require('./uradRequests');

router.get('/devices/:city', function (req, res) {
    var city = req.params.city;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices',
        method: 'GET',
        city: city
    };

    httpreq.getDevices(options, res);
});

router.get('/devices/online/:city', function (req, res) {
    var city = req.params.city;
    console.log(city);
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices',
        method: 'GET',
        city: city,
        online: 1
    };

    httpreq.getDevices(options, res);
});

router.get('/:device/avg', function (req, res) {
    var device = req.params.device;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices',
        method: 'GET',
        device: device
    };

    httpreq.getAverages(options, res);
});

router.get('/averages', function (req, res) {
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices',
        method: 'GET'
    };

    httpreq.getAverages(options, res);
});

var params = '(|temperature|humidity|pressure|voc|co2|ch2o|pm25|cpm)';
var limits = {
    temperature: 0.2,
    pressure: 10,
    humidity: 2,
    voc: 100,
    co2: 5,
    ch2o: 3,
    pm25: 3
};

router.get('/:device/:param' + params + '/:interval', function (req, res) {

    var device = req.params.device;
    var interval = req.params.interval;
    var param = req.params.param;
    if (interval <= 0) {
        res.send('{error: "Interval must be positive"}');
    } else {
        var options = {
            headers: uradHeaders,
            host: 'data.uradmonitor.com',
            path: '/api/v1/devices/' + device + '/' + param + '/' + interval,
            method: 'GET',
            param: param,
            limit: limits[param]
        };
        httpreq.getData(options, res);
    }

});

module.exports = router;