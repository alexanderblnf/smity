'use strict';

angular
.module('auth')
.service('SecurityService', [
	'LocalStorage',
	'Constants',
	'SecurityResource',
	'$rootScope',
	'$cookies',
	SecurityService]);

function SecurityService(LocalStorage, Constants, SecurityResource, $rootScope, $cookies) {
	return {
		login: login,
		register: register,
		remove: remove,
		isAuthenticated: isAuthenticated,
		getToken: getToken,
		logout: logout,
		loggedIn: loggedIn,
		setCredentials: setCredentials,
		clearCredentials: clearCredentials
	};

	function loggedIn() {
		return SecurityResource.loggedin().$promise
			.then(function (response) {
				return response;
			});
    }

	function login(credentials) {
		return SecurityResource.login(credentials).$promise;
	}

	function register(credentials) {
		return SecurityResource.register(credentials).$promise;
	}

	function remove() {
		return LocalStorage.remove(Constants.AUTH.TOKEN);
	}

	function isAuthenticated() {
		return !!LocalStorage.get(Constants.AUTH.TOKEN);
	}

	function getToken() {
		return LocalStorage.get(Constants.AUTH.TOKEN);
	}

	function logout() {
		return SecurityResource.logout().$promise;
	}

	function setCredentials(username, password) {
		$rootScope.globals = {
			currentUser: {
				username: username,
				authdata: password
			}
		};

		// store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
		var cookieExp = new Date();
		cookieExp.setDate(cookieExp.getDate() + 7);
		$cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
	}

	function clearCredentials() {
		$rootScope.globals = {};
		$cookies.remove('globals');
		remove();
	}
}