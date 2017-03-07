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

router.get('/:device/temp/:interval', function (req, res) {

    var device = req.params.device;
    var interval = req.params.interval;
    console.log(device + '\n' + interval);
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices/' + device + '/temperature/' + interval,
        method: 'GET',
        param: 'temperature',
        limit: 0.2
    };
    httpreq.getData(options, res);

});

router.get('/:device/pressure/:interval', function (req, res) {
    var device = req.params.device;
    var interval = req.params.interval;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices/' + device + '/pressure/' + interval,
        method: 'GET',
        param: 'pressure',
        limit: 10
    };
    httpreq.getData(options, res);
});

router.get('/:device/humidity/:interval', function (req, res) {
    var device = req.params.device;
    var interval = req.params.interval;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices/' + device + '/humidity/' + interval,
        method: 'GET',
        param: 'humidity',
        limit: 2
    };
    httpreq.getData(options, res);
});

router.get('/:device/voc/:interval', function (req, res) {
    var device = req.params.device;
    var interval = req.params.interval;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices/' + device + '/voc/' + interval,
        method: 'GET',
        param: 'voc',
        limit: 100
    };
    httpreq.getData(options, res);
});

router.get('/:device/co2/:interval', function (req, res) {
    var device = req.params.device;
    var interval = req.params.interval;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices/' + device + '/co2/' + interval,
        method: 'GET',
        param: 'co2',
        limit: 5
    };
    httpreq.getData(options, res);
});

router.get('/:device/ch2o/:interval', function (req, res) {
    var device = req.params.device;
    var interval = req.params.interval;
    var options = {
        headers: uradHeaders,
        host: 'data.uradmonitor.com',
        path: '/api/v1/devices/' + device + '/ch2o/' + interval,
        method: 'GET',
        param: 'ch2o',
        limit: 5
    };
    httpreq.getData(options, res);
});

module.exports = router;