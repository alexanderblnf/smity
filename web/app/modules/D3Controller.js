'use strict';

angular.module('Smity')
.controller('D3Controller', [D3Controller]);

function D3Controller() {

	var vm = this;

	vm.message = 'Hello world!';
	vm.startDate = undefined;
	vm.endDate = undefined;
}