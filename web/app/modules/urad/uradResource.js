'use strict';

angular.module('urad')
	.factory('UradResource', ['$resource', 'Constants', UradResource]);

function UradResource($resource, Constants) {
	return $resource(Constants.URL.LOCALHOST + '/elastic/live', {}, {
		'live': {
			method: 'GET'
		}
	})
}