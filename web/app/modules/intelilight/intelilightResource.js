'use strict';

angular.module('intelilight')
    .factory('IntelilightResource', ['$resource', 'Constants', IntelilightResource]);

function IntelilightResource($resource, Constants) {
	return $resource(Constants.URL.SERVER + '/intelilight/controllers/latest', {}, {
        'latest': {
            method: 'GET',
            isArray: true
        }
	});
}