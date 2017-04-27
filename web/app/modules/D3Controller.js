'use strict';

angular.module('Smity')
.controller('D3Controller', ['UradService', D3Controller]);

function D3Controller(UradService) {

	var vm = this;

	vm.message = 'Hello world!';
	vm.startDate = undefined;
	vm.endDate = undefined;
	vm.predict = predict;

    function predict(param, time, callback) {
        UradService.predict(param, time)
            .then(function (response) {
                callback(response);
            });
    }
}