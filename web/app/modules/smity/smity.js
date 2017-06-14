'use strict';

angular
    .module('smity', [
		'ngRoute',
		'ngResource',
		'ds.clock',
		'ui.router',
		'ngMaterial',
		'ngCookies',
		'moment-picker',
		'auth',
		'd3Module',
		'elastic',
		'intelilight',
        'beacon',
        'preference'
	])

	.config([
		'$stateProvider',
		'$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/dashboard');

			$stateProvider
				.state('app', {
					url: '',
					abstract: true,
                    templateUrl: '/templates/smity/home.html',
					controller: 'SmityController as vm'
				})
				.state('app.home', {
					url: '/dashboard',
					views: {
						'home': {
                            templateUrl: '/templates/smity/content.html'
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
							templateUrl: '/templates/intelilight/inteliMap.html',
							controller: 'IntelilightController as vm'
						}
					}
				})
				.state('app.beacon', {
					url: '/beacon',
					views: {
						'home': {
							templateUrl: '/templates/beacons/beacon.html',
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
			SERVER: 'http://localhost'
		},
		UNITS: {
			temperature: '°C',
			pressure: 'Pa',
			humidity: '%',
			co2: 'ppm',
			pm25: 'µg/m3',
			ch2o: 'ppm',
			cpm: 'µSv/h',
			voc: ''
		},
		NAMES: {
			temperature: 'Temperatura',
			pressure: 'Presiune',
			humidity: 'Umiditate',
			co2: 'Dioxid de carbon',
			pm25: 'Particule de praf',
			ch2o: 'Formaldehida',
			cpm: 'Radiatii',
			voc: 'Compusi organici volatili'
		}
	});

var initHeatMap = {
	InitHeatMap: ['SharedVariables', 'MapService', '$state', function (SharedVariables, MapService, $state) {
		var mapType = SharedVariables.getMapType();
        var mapObject = undefined;

        if (mapType === true) {
			var date = new Date();
			var now = Math.floor(date.getTime() / 1000);
			var fromTime = now - 3600 * 24;
			var toTime = now;
			setTimeout(function () {
				mapObject = MapService.initMap($state.current.name.split('.')[1], fromTime, toTime);
			}, 0.1);
		}
	}]
};


