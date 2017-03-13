'use strict';

angular
.module('Smity')
.factory('SecurityResource', [
	'$resource',
	'Constants',
	SecurityResource]);

function SecurityResource($resource, Constants) {
	return $resource(Constants.URL.LOCALHOST + '/login', {}, {
		'authenticate': {
			method: 'POST'
		},
		'register': {
			method: 'POST',
			url: Constants.URL.LOCALHOST + '/user'
		},
		'logout': {
			method: 'GET',
			url: Constants.URL.LOCALHOST + '/logout'
		},
		'loggedin': {
			method: 'GET',
			url: Constants.URL.LOCALHOST + '/isloggedin'
		}
	});
}