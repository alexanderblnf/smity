'use strict';

angular.module('smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
	var mapType = false;

	return {
		getMapType: getMapType,
		setMapType: setMapType
	};

	function setMapType() {
		mapType = !mapType;
	}

	function getMapType() {
		return mapType;
	}

}