'use strict';

angular.module('urad')
.service('UradService', ['UradResource', UradService]);

function UradService(UradResource) {
	return {
		getAll: getAll
	};

	function getAll() {
		return UradResource.live().$promise;
	}
}