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
    vm.startDateHeatMap = undefined;
    vm.endDateHeatMap = undefined;
    vm.mapType = SharedVariables.getMapType();

	vm.predict = predict;
    vm.apply = apply;

	$scope.$on('map-changed', function () {
        vm.mapType = SharedVariables.getMapType();
        vm.initHeatMap = SharedVariables.getInitHeatMap();

		if (vm.initHeatMap === 1 || vm.mapType === true) {
            var date = new Date();
            var now = Math.floor(date.getTime() / 1000);
            var fromTime = now - 3600 * 24;
            var toTime = now;
            setTimeout(function () {
                MapService.initMap($state.current.name.split('.')[1], fromTime, toTime);
            }, 0.1);
        }
    });

    function predict(param, time, callback) {
	    ElasticService.predict(param, time)
            .then(function (response) {
                callback(response);
            });
    }

    function apply() {
        var startDate = new Date(vm.startDateHeatMap);
        var endDate = new Date(vm.endDateHeatMap);
        var unixStart = Math.floor(startDate.getTime() / 1000);
        var unixEnd = Math.floor(endDate.getTime() / 1000);
        setTimeout(function () {
            MapService.initMap($state.current.name.split('.')[1], unixStart, unixEnd);
        }, 0.1);
    }
}