'use strict';

angular.module('beacon')
    .factory('BeaconResource', ['$resource', 'Constants', BeaconResource]);

function BeaconResource($resource, Constants) {
    return $resource(Constants.URL.LOCALHOST + '/beacons/campaigns', {}, {
        'campaigns': {
            method: 'GET',
            isArray: true
        },
        'profile': {
            method: 'GET',
            url: Constants.URL.LOCALHOST + '/beacons/profile/:campaign',
            isArray: true
        },
        'insights': {
            method: 'GET',
            url: Constants.URL.LOCALHOST + '/beacons/insights/:campaign/:startTime/:endTime',
            isArray: true
        }
    })
}