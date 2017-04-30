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
        'moment-picker',
		'auth',
		'd3Module',
		'elastic'
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

	.config([
		'$stateProvider',
		'$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/home');

			$stateProvider
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
							template: '<chart-and-map data-param="temperature"' +
							'data-y-axis="Temperatura (Celsius)"' +
							'data-map-type="vm.mapType"' +
							'data-predict-callback="vm.predict"' +
							'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.pressure', {
                    url: '/pressure',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="pressure"' +
	                        'data-y-axis="Presiune (Pascal)"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.humidity', {
                    url: '/humidity',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="humidity"' +
	                        'data-y-axis="Umiditate (%)"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.co2', {
                    url: '/co2',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="co2"' +
	                        'data-y-axis="Dioxid de carbon (ppm)"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.pm25', {
                    url: '/pm25',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="pm25"' +
	                        'data-y-axis="Particule de praf (µg/m³)"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.voc', {
                    url: '/voc',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="voc"' +
	                        'data-y-axis="Compusi organici volatili"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.ch2o', {
                    url: '/ch2o',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="ch2o"' +
	                        'data-y-axis="Formaldehida (ppm)"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    }
                })
                .state('app.cpm', {
                    url: '/cpm',
                    views: {
                        'home': {
	                        template: '<chart-and-map data-param="cpm"' +
	                        'data-y-axis="Radiatii (µSv/h)"' +
	                        'data-predict-callback="vm.predict"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"></chart-and-map>',
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

	    var SharedVariables = $injector.get('SharedVariables');
	    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
		    SharedVariables.clearInitHeatMap();

		    if (SharedVariables.getMapType() === true) {
			    $rootScope.$broadcast('map-changed');
		    }
	    });
    }])

	.constant('Constants', {
		URL: {
			ELASTIC: 'http://141.85.232.64:9200',
			LOCALHOST: 'http://localhost:8080'
		}
	});

