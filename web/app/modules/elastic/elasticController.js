'use strict';

angular.module('elastic')
	.controller('ElasticController', ['ElasticService', ElasticController]);

function ElasticController(ElasticService) {
	var vm = this;

	vm.getAll = getAll;
	vm.liveValues = {};

	function getAll() {
		ElasticService.getAll().then(function (response) {
			vm.liveValues = response;
		});
	}
}