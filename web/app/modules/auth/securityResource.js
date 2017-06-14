'use strict';

angular
.module('auth')
	.factory('SecurityResource', ['$resource', 'Constants', SecurityResource]);

function SecurityResource($resource, Constants) {
	return $resource(Constants.URL.SERVER + '/login', {}, {
		'login': {
			method: 'POST'
		},
		'register': {
			method: 'POST',
			url: Constants.URL.SERVER + '/signup'
		},
		'logout': {
			method: 'GET',
			url: Constants.URL.SERVER + '/logout'
		},
		'loggedin': {
			method: 'GET',
			url: Constants.URL.SERVER + '/isloggedin'
        },
        'addMember': {
            method: 'POST',
	        url: Constants.URL.SERVER + '/admin/add-manager'
		}
	});
}