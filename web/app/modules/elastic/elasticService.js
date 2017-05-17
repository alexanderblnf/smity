'use strict';

angular.module('elastic')
	.service('ElasticService', ['ElasticResource', ElasticService]);

function ElasticService(ElasticResource) {
	return {
        getAll: getAll,
        predict: predict,
        heatMap: heatMap,
        weekly: weekly
	};

	function getAll() {
		return ElasticResource.live().$promise;
	}

    function predict(param, time) {
	    return ElasticResource.predict({param: param, time: time}).$promise;
    }

	function heatMap(param, fromTime, toTime) {
		return ElasticResource.heatmap({param: param, timeStart: fromTime, timeEnd: toTime}).$promise;
    }

    function weekly(param) {
        return ElasticResource.weekly({param: param}).$promise;
    }
}