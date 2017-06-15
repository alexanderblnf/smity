var express = require('express');
var router = express.Router();
var beaconRequests = require('./beaconRequests');
var beaconHeaders = {
    'X-Zoniz-Token': '15c8cb76b1b.48fb2fd2ae72d69',
    'X-Zoniz-User-Email': 'publicapi@zoniz.com'
};

router.get('/campaigns', function (req, res) {
    var options = {
        headers: beaconHeaders,
        host: 'e-albaiulia.zoniz.com',
        path: '/p/api/shop/e-albaiulia/campaigns',
        method: 'GET'
    };
    beaconRequests.getCampaigns(options, res)
});

router.get('/profile/static/voucher/:campaign', function (req, res) {
    var campaign = req.params.campaign;
    var options = {
        headers: beaconHeaders,
        host: 'e-albaiulia.zoniz.com',
        path: '/p/api/shop/e-albaiulia/campaignusersprofile/static/voucher/' + campaign,
        method: 'GET'
    };
    beaconRequests.getCampaignUsers(options, res);
});

router.get('/users/static/voucher/:campaign', function (req, res) {
    var campaign = req.params.campaign;
    var options = {
        headers: beaconHeaders,
        host: 'e-albaiulia.zoniz.com',
        path: '/p/api/shop/e-albaiulia/campaignusers/static/voucher/' + campaign,
        method: 'GET'
    };
    beaconRequests.getCampaignUsers(options, res);
});

router.get('/insights/static/voucher/:campaign/:start/:end', function (req, res) {
    var campaign = req.params.campaign;
    var start = new Date(req.params.start * 1000).toISOString();
    var end = new Date(req.params.end * 1000).toISOString();

    var options = {
        headers: beaconHeaders,
        host: 'e-albaiulia.zoniz.com',
        path: '/p/api/shop/e-albaiulia/campaigninsights/static/voucher/' + campaign + "?startDate=" + start + '&endDate=' + end + '&type=mobileview',
        method: 'GET'
    };
    beaconRequests.getCampaignUsers(options, res);
});

module.exports = router;