'use strict';

angular
	.module('auth')
	.service('SecurityService', [
		'SecurityResource',
		'$rootScope',
		'$cookies', '$http', '$state', 'Constants',
		SecurityService]);

function SecurityService(SecurityResource, $rootScope, $cookies, $http, $state, Constants) {
	return {
		login: login,
		register: register,
		logout: logout,
		loggedIn: loggedIn,
		setCredentials: setCredentials,
		getCredentials: getCredentials,
		clearCredentials: clearCredentials,
		addMember: addMember
	};


	function login(credentials) {
		return SecurityResource.login(credentials).$promise;
	}

	function register(credentials) {
		return SecurityResource.register(credentials).$promise;
	}

	function logout() {
		return SecurityResource.logout().$promise;
	}

	function loggedIn() {
		$http.get(Constants.URL.SERVER + '/isloggedin')
			.then(function (response) {
				if (response.data === false) {
					$state.go('login');
				}
			});
	}

	function setCredentials(firstName, lastName, perms) {
		$rootScope.globals = {
			username: firstName + ' ' + lastName,
			permissions: perms
		};

		// store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
		var cookieExp = new Date();
		cookieExp.setDate(cookieExp.getDate() + 7);
		$cookies.putObject('globals', $rootScope.globals, {expires: cookieExp});
	}

	function getCredentials() {
		return $cookies.getObject('globals');
	}

	function clearCredentials() {
		$rootScope.globals = {};
		$cookies.remove('globals');
	}

	function addMember(credentials) {
		return SecurityResource.addMember(credentials).$promise;
	}
}