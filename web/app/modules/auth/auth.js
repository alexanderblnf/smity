'use strict';

angular
	.module('auth', ['ngResource', 'ngCookies'])
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: '/templates/login.html',
					// controller: 'SecurityController as vm'
				})
				.state('register', {
						url: '/register',
						templateUrl: '/templates/register.html',
						// controller: 'SecurityController as vm'
					});

		}])
	.run(['$rootScope', '$location', '$cookies',
		function ($rootScope, $location, $cookies) {
		// keep user logged in after page refresh
		$rootScope.globals = $cookies.getObject('globals') || {};
		$rootScope.$on('$locationChangeStart', function () {
			// redirect to login page if not logged in and trying to access a restricted page
			var restrictedPage = $location.path() !== '/login';
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('/login');
			}
		});
	}]);

