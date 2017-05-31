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
        'elastic',
        'intelilight',
	    'beacon', 'preference'
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
            $urlRouterProvider.otherwise('/dashboard');

            $stateProvider
                .state('app', {
                    url: '',
                    abstract: true,
                    templateUrl: '/templates/home.html',
                    controller: 'SmityController as vm'
                })
                .state('app.home', {
                    url: '/dashboard',
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
                            'data-y-axis="Temperatura"' +
                            'data-map-type="vm.mapType"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.pressure', {
                    url: '/pressure',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="pressure"' +
                            'data-y-axis="Presiune"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.humidity', {
                    url: '/humidity',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="humidity"' +
                            'data-y-axis="Umiditate"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.co2', {
                    url: '/co2',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="co2"' +
                            'data-y-axis="Dioxid de carbon"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.pm25', {
                    url: '/pm25',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="pm25"' +
                            'data-y-axis="Particule de praf"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.voc', {
                    url: '/voc',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="voc"' +
                            'data-y-axis="Compusi organici volatili"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.ch2o', {
                    url: '/ch2o',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="ch2o"' +
                            'data-y-axis="Formaldehida"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.cpm', {
                    url: '/cpm',
                    views: {
                        'home': {
                            template: '<chart-and-map data-param="cpm"' +
                            'data-y-axis="Radiatii"' +
                            'data-predict-callback="vm.predict"' +
                            'data-weekly-callback="vm.weekly"' +
                            'data-units="vm.units"' +
                            'data-map-type="vm.mapType"' +
                            'data-heat-map-function="vm.apply"' +
                            'data-set-type-function="vm.setType"></chart-and-map>',
                            controller: 'D3Controller as vm'
                        }
                    },
	                resolve: initHeatMap
                })
                .state('app.intelilight', {
                    url: '/intelilight',
                    views: {
                        'home': {
                            templateUrl: '/templates/inteliMap.html',
                            controller: 'IntelilightController as vm'
                        }
                    }
                })
                .state('app.beacon', {
                    url: '/beacon',
                    views: {
                        'home': {
                            templateUrl: '/templates/beacon.html',
                            controller: 'BeaconController as vm'
                        }
                    }
                })
            ;
        }])

    .run(['$rootScope', '$http', '$state', '$injector', function ($rootScope, $http, $state, $injector) {
        var SecurityService = $injector.get('SecurityService');
        SecurityService.loggedIn();
    }])

    .constant('Constants', {
        URL: {
            ELASTIC: 'http://141.85.232.64:9200',
            LOCALHOST: 'http://localhost'
        }
    });

var initHeatMap = {
	InitHeatMap: ['SharedVariables', 'MapService', '$state', function (SharedVariables, MapService, $state) {
		var mapType = SharedVariables.getMapType();
		var initHeatMap = SharedVariables.getInitHeatMap();
		var mapObject;

		if (initHeatMap === 1 || mapType === true) {
			var date = new Date();
			var now = Math.floor(date.getTime() / 1000);
			var fromTime = now - 3600 * 24;
			var toTime = now;
			setTimeout(function () {
				mapObject = MapService.initMap($state.current.name.split('.')[1], fromTime, toTime);
			}, 0.1);

			return mapObject;
		}
	}]
};


