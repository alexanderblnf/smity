'use strict';

angular
	.module('Smity', [
		'ngRoute',
		'ngResource',
		'myApp.version',
		'ds.clock',
		'ui.router',
		'ngMaterial',
		'ngCookies',
		])

	.config(['$httpProvider',
		function ($httpProvider) {
			$httpProvider.defaults.headers.common.Accept = 'application/x-www-form-urlencoded';
			$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
		}])
	//
	// .config(['$httpProvider', function ($httpProvider) {
	// 	$httpProvider.interceptors.push('SecurityInterceptor');
	// }])

	// .config(['$urlRouterProvider', function navInterceptorConfig($urlRouterProvider) {
	// 	$urlRouterProvider
	// 		.when('/login', [
	// 			'$state',
	// 			'$injector',
	// 			function ($state, $injector) {
	// 				var SecurityService = $injector.get('SecurityService');
	//
	// 				// if already in login state and trying to reach again `/login`
	// 				// don't do a redirection because it will enter in an infinite loop
	// 				if ($state.$current.name === 'login') {
	// 					return true;
	// 				}
	//
	// 				// if already authenticated and trying to reach `/login`
	// 				if (SecurityService.isAuthenticated()) {
	// 					return "/";
	// 				}
	//
	// 				return false;
	// 			}
	// 		])
	// 		.otherwise(function () {
	// 			return '/login';
	// 		});
	// }
	// ])

	.config([
		'$stateProvider',
		'$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			 $urlRouterProvider.otherwise('/');

			$stateProvider
				// .state('login', {
				// 	url: '/login',
				// 	templateUrl: '/templates/login.html',
				// 	controller: 'SecurityController as vm'
				// })
				// .state('register', {
				// 	url: '/register',
				// 	templateUrl: '/templates/register.html',
				// 	controller: 'SecurityController as vm'
				// })
				.state('home', {
					url: '/',
					views: {
						'notification': {
							templateUrl: '/templates/notification.html',
							controller: 'SmityController as vm'
						},
						'menu': {
							templateUrl: '/templates/menu.html'
						},
						'contentHeader': {
							templateUrl: '/templates/contentHeader.html'
						},
						'content': {
							templateUrl: '/templates/content.html'
						}
					}
				})
			;
		}])

	.constant('Constants', {
		URL: {
			API: 'http://35.167.158.182:50001',
			LOCALHOST: 'http://localhost:8080'
		},
		AUTH: {
			TOKEN: 'Token'
		}
	});

