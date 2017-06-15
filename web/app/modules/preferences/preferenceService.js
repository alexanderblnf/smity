'use strict';

angular.module('preference')
	.service('PreferenceService', ['PreferenceResource', PreferenceService]);

function PreferenceService(PreferenceResource) {
	return {
		getAll: getAll,
		update: update
	};

	function getAll() {
		return PreferenceResource.getAll().$promise;
	}

	function update(preferences) {
		return PreferenceResource.update({prefs: preferences}).$promise;
	}
}