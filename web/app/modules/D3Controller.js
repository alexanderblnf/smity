'use strict';

angular.module('Smity')
    .controller('D3Controller', ['UradService', 'SharedVariables', '$scope', 'MapService', D3Controller]);

function D3Controller(UradService, SharedVariables, $scope, MapService) {

    var vm = this;

    vm.message = 'Hello world!';
    vm.startDate = undefined;
    vm.endDate = undefined;
    vm.predict = predict;
    vm.mapType = SharedVariables.getMapType();

    $scope.$on('map-changed', function (event, args) {
        vm.mapType = SharedVariables.getMapType();
        vm.initHeatMap = SharedVariables.getInitHeatMap();

        if (vm.initHeatMap === 1) {
            setTimeout(function () {
                MapService.initMap();
            }, 0.1);

        }
    });

    function predict(param, time, callback) {
        UradService.predict(param, time)
            .then(function (response) {
                callback(response);
            });
    }
}