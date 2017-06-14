'use strict';

angular.module('intelilight')
    .factory('IntelilightResource', ['$resource', 'Constants', IntelilightResource]);

function IntelilightResource($resource, Constants) {
	return $resource(Constants.URL.SERVER + '/intelilight/controllers', {}, {
        'controllers': {
            method: 'GET'
        },
        'latest': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/intelilight/controllers/latest',
            isArray: true
        },
        'position': {
            method: 'GET',
	        url: Constants.URL.SERVER + '/intelilight/position'
        }
    })
}