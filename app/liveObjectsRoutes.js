var express = require('express');
var router = express.Router();
var httpreq = require('./liveObjectsRequests');
var headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': '7181573bce384c33be9e5234d04a5302'
};

router.get('/:device/:limit', function (req, res) {
    var device = req.params.device;
    var limit = req.params.limit;
    var options = {
        headers: headers,
        host: 'liveobjects.orange-business.com',
        path: '/api/v0/data/streams/uradmonitor%3A' + device + '?limit=' + limit,
        method: 'GET'
    };

    httpreq.getData(options, res);
});

module.exports = router;
