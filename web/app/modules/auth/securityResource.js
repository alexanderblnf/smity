'use strict';

angular
.module('auth')
.factory('SecurityResource', [
	'$resource',
	'Constants',
	SecurityResource]);

function SecurityResource($resource, Constants) {
	return $resource(Constants.URL.LOCALHOST + '/login', {}, {
		'login': {
			method: 'POST'
		},
		'register': {
			method: 'POST',
			url: Constants.URL.LOCALHOST + '/signup'
		},
		'logout': {
			method: 'GET',
			url: Constants.URL.LOCALHOST + '/logout'
		},
		'loggedin': {
			method: 'GET',
			url: Constants.URL.LOCALHOST + '/isloggedin'
		},
		'addMember': {
			method: 'POST',
			url: Constants.URL.LOCALHOST + ' /admin/add-manager'
		}
	});
}