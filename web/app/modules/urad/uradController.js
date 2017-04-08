'use strict';

angular.module('urad')
.controller('UradController', ['UradService', UradController]);

function UradController(UradService) {
	var vm = this;

	vm.getAll = getAll;
	vm.liveValues = {};

	function getAll() {
		UradService.getAll().then(function (response) {
			vm.liveValues = response;
		});
	}
}