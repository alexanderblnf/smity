'use strict';

angular.module('Smity')
    .controller('D3Controller', ['UradService', 'SharedVariables', D3Controller]);

function D3Controller(UradService, SharedVariables) {

    var vm = this;

    vm.message = 'Hello world!';
    vm.startDate = undefined;
    vm.endDate = undefined;
    vm.predict = predict;
    vm.mapType = SharedVariables.getMapType();

    function predict(param, time, callback) {
        UradService.predict(param, time)
            .then(function (response) {
                callback(response);
            });
    }
}