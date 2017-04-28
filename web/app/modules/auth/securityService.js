'use strict';

angular
.module('auth')
.service('SecurityService', [
	'LocalStorage',
	'SecurityResource',
	'$rootScope',
    '$cookies', '$http', '$state', 'Constants',
	SecurityService]);

function SecurityService(LocalStorage, SecurityResource, $rootScope, $cookies, $http, $state, Constants) {
	return {
		login: login,
		register: register,
		logout: logout,
		loggedIn: loggedIn,
		setCredentials: setCredentials,
        clearCredentials: clearCredentials,
        addMember: addMember
	};


    function loggedIn() {
        $http.get(Constants.URL.LOCALHOST + '/isloggedin').then(function (response) {
            console.log(response);

            if (response.data === false) {
                $state.go('login');
            }
        })
    }

	function login(credentials) {
		return SecurityResource.login(credentials).$promise;
	}

	function register(credentials) {
		return SecurityResource.register(credentials).$promise;
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

    function addMember(credentials) {
        return SecurityResource.addMember(credentials).$promise;
    }
}