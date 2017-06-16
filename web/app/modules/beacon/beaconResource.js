'use strict';

angular.module('beacon')
    .factory('BeaconResource', ['$resource', 'Constants', BeaconResource]);

function BeaconResource($resource, Constants) {
	return $resource(Constants.URL.SERVER + '/beacons/campaigns', {}, {
        'campaigns': {
            method: 'GET',
            isArray: true
        },
        'profile': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/beacons/profile/static/voucher/:campaign'
        },
        'insights': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/beacons/insights/static/voucher/:campaign/:startTime/:endTime',
            isArray: true
        }
    })
}