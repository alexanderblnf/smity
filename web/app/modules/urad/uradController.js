'use strict';

angular
	.module('urad')
	.controller('UradController', [
		'ElasticService',
		'SharedVariables',
		'UradHeatmapService',
		'$state',
		'Constants',
		UradController]);

function UradController(ElasticService, SharedVariables, UradHeatmapService, $state, Constants) {
    var vm = this;

    vm.message = 'Hello world!';
    vm.startDate = undefined;
    vm.endDate = undefined;
    vm.startDateHeatMap = undefined;
    vm.endDateHeatMap = undefined;
    vm.mapType = SharedVariables.getMapType();
    vm.mapObject = undefined;
	vm.units = Constants.UNITS;

	vm.predict = predict;
    vm.apply = apply;
    vm.weekly = weekly;
	vm.setType = setType;

	function setType() {
		SharedVariables.setMapType();
		vm.mapType = SharedVariables.getMapType();

        if (vm.mapType === true) {
			var date = new Date();
			var now = Math.floor(date.getTime() / 1000);
			var fromTime = now - 3600 * 24;
			var toTime = now;
			setTimeout(function () {
				vm.mapObject = UradHeatmapService.initMap($state.current.name.split('.')[1], fromTime, toTime);
			}, 0.1);
		}
	}

    function predict(param, time, callback) {
	    ElasticService.predict(param, time)
            .then(function (response) {
                callback(response);
            });
    }

	function apply(startTime, stopTime) {
        setTimeout(function () {
	        UradHeatmapService.reloadMap(vm.mapObject, $state.current.name.split('.')[1], startTime, stopTime)
        }, 0.1);
    }

    function weekly(param, callback) {
        ElasticService.weekly(param)
            .then(function (response) {
                callback(response);
            })
    }
}