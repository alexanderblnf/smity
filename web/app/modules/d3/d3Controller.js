'use strict';

angular.module('d3Module')
	.controller('D3Controller', ['ElasticService',
		'SharedVariables',
		'$scope',
		'MapService',
		'$state',
		D3Controller]);

function D3Controller(ElasticService, SharedVariables, $scope, MapService, $state) {

    var vm = this;

    vm.message = 'Hello world!';
    vm.startDate = undefined;
    vm.endDate = undefined;
    vm.mapType = SharedVariables.getMapType();

	vm.predict = predict;

	$scope.$on('map-changed', function () {
        vm.mapType = SharedVariables.getMapType();
        vm.initHeatMap = SharedVariables.getInitHeatMap();

		if (vm.initHeatMap === 1 || vm.mapType === true) {
            setTimeout(function () {
	            MapService.initMap($state.current.name.split('.')[1]);
            }, 0.1);
        }
    });

    function predict(param, time, callback) {
	    console.log($state);
	    ElasticService.predict(param, time)
            .then(function (response) {
                callback(response);
            });
    }
}