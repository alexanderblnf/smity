'use strict';

angular.module('intelilight')
    .factory('IntelilightResource', ['$resource', 'Constants', IntelilightResource]);

function IntelilightResource($resource, Constants) {
    return $resource(Constants.URL.LOCALHOST + '/intelilight/controllers', {}, {
        'controllers': {
            method: 'GET'
        },
        'latest': {
            method: 'GET',
            url: Constants.URL.LOCALHOST + '/intelilight/controllers/latest',
            isArray: true
        },
        'position': {
            method: 'GET',
            url: Constants.URL.LOCALHOST + '/intelilight/position'
        }
    })
}