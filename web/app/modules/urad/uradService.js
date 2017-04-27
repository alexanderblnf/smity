'use strict';

angular.module('urad')
.service('UradService', ['UradResource', UradService]);

function UradService(UradResource) {
	return {
		getAll: getAll,
		predict: predict
	};

	function getAll() {
		return UradResource.live().$promise;
	}

	function predict(param, time) {
		return UradResource.predict({param:param, time:time}).$promise;
    }
}