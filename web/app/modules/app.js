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
		'urad',
        'moment-picker',
        'auth'
	])

    // .config(['$httpProvider',
    // 	function ($httpProvider) {
    // 		$httpProvider.defaults.headers.common.Accept = 'application/x-www-form-urlencoded';
    // 		$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    // 	}])
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
			$urlRouterProvider.otherwise('/home');

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
				.state('app', {
					url: '',
					abstract: true,
					templateUrl: '/templates/home.html',
					controller: 'SmityController as vm'
				})
				.state('app.home', {
					url: '/home',
					views: {
						'home': {
							templateUrl: '/templates/content.html'
						}
					}
				})
				.state('app.temperature', {
					url: '/temperature',
					views: {
						'home': {
							template: '<chart-and-map param="temperature" y-axis="Temperatura (Celsius)"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.pressure', {
					url: '/pressure',
					views: {
						'home': {
							template: '<chart-and-map param="pressure" y-axis="Presiune (Pascal)" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.humidity', {
					url: '/humidity',
					views: {
						'home': {
							template: '<chart-and-map param="humidity" y-axis="Umiditate (%)" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.co2', {
					url: '/co2',
					views: {
						'home': {
							template: '<chart-and-map param="co2" y-axis="Dioxid de carbon (ppm)" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.pm25', {
					url: '/pm25',
					views: {
						'home': {
							template: '<chart-and-map param="pm25" y-axis="Particule de praf (µg/m³)" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.voc', {
					url: '/voc',
					views: {
						'home': {
							template: '<chart-and-map param="voc" y-axis="Compusi organici volatili" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.ch2o', {
					url: '/ch2o',
					views: {
						'home': {
							template: '<chart-and-map param="ch2o" y-axis="Formaldehida (ppm)" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
				.state('app.cpm', {
					url: '/cpm',
					views: {
						'home': {
							template: '<chart-and-map param="cpm" y-axis="Radiatii (µSv/h)" predict-callback="vm.predict"></chart-and-map>',
							controller: 'D3Controller as vm'
						}
					}
				})
			;
		}])

    .run(['$rootScope', '$http', '$state', '$injector', function ($rootScope, $http, $state, $injector) {
        var SecurityService = $injector.get('SecurityService');
        SecurityService.loggedIn();
	    $rootScope.$state = $state;
    }])

	.constant('Constants', {
		URL: {
			ELASTIC: 'http://141.85.232.64:9200',
			LOCALHOST: 'http://localhost:8080'
		},
		AUTH: {
			TOKEN: 'Token'
		}
	});

