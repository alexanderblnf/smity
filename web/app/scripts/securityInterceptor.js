'use strict';

angular
.module('Smity')
.service('SecurityInterceptor', ['$injector', '$q', SecurityInterceptor]);

function SecurityInterceptor($injector, $q) {
	return {
		request: request
	};

	function request(config) {
		var SecurityService = $injector.get('SecurityService', 'SecurityInterceptor');
		// config.withCredentials = true;
		if (!SecurityService.isAuthenticated()) {
			// SecurityService.logout();
		}

		return config;
	}

	function responseError(rejection) {
		var $state = $injector.get('$state', 'SecurityInterceptor');
		var SecurityService = $injector.get('SecurityService', 'SecurityInterceptor');

		//If 401 and logged in - make a logout
		if (rejection.status === HttpStatus.UNAUTHORIZED && SecurityService.isAuthenticated()) {
			//Prevent further log-outs
			SecurityService.remove();

			return SecurityService
				.remove()
				.then(function () {
					$state.go('login');
					return $q.reject(rejection);
				});
		}

		return $q.reject(rejection);
	}
}