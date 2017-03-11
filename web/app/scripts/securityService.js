'use strict';

angular
.module('Smity')
.service('SecurityService', [
	'$http',
	'LocalStorage',
	'Constants',
	'$state',
	'SecurityResource',
	SecurityService]);

function SecurityService($http, LocalStorage, Constants, $state, SecurityResource) {
	return {
		login: login,
		register: register
		// logout: logout,
		// isAuthenticated: isAuthenticated,
		// getToken: getToken
	};
	
	function login(credentials) {
		// return $http.post(Constants.URL.API + '/auth', credentials)
		// 	.then(function (response) {
		// 		LocalStorage.put(Constants.AUTH.TOKEN, response);
		// 		$state.go('home');
		// 	});

		return SecurityResource.authenticate(credentials).$promise;
	}

	function register(credentials) {
		return SecurityResource.register(credentials).$promise;
	}

	// function logout() {
	// 	return LocalStorage.remove(Constants.AUTH.TOKEN);
	// }
	//
	// function isAuthenticated() {
	// 	return !!LocalStorage.get(Constants.AUTH.TOKEN);
	// }
	//
	// function getToken() {
	// 	return LocalStorage.get(Constants.AUTH.TOKEN);
	// }
}