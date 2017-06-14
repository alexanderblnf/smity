'use strict';

angular.module('preference')
	.factory('PreferenceResource', ['$resource', 'Constants', PreferenceResource]);

function PreferenceResource($resource, Constants) {
	return $resource(Constants.URL.SERVER + '/preferences/get', {}, {
		'getAll': {
			method: 'GET',
			cache: true
		},
		'update': {
			url: Constants.URL.SERVER + '/preferences/update',
			method: 'POST'
		}
	})
}