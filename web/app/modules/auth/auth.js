'use strict';

angular
	.module('auth', ['ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: '/templates/login.html',
					controller: 'SecurityController as vm'
				})
				.state('register', {
						url: '/register',
						templateUrl: '/templates/register.html',
						controller: 'SecurityController as vm'
					});

		}])
	.run(['$rootScope', '$location', '$cookies', function ($rootScope, $location, $cookies) {
		// keep user logged in after page refresh
		$rootScope.globals = $cookies.getObject('globals') || {};
		$rootScope.$on('$routeChangeStart', function () {
			// redirect to login page if not logged in and trying to access a restricted page
			var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('/login');
			}
		});
	}]);

