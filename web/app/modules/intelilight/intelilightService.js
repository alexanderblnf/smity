'use strict';

angular.module('intelilight')
    .service('IntelilightService', ['IntelilightResource', IntelilightService]);

function IntelilightService(IntelilightResource) {
    return {
        getControllers: getControllers,
        getLatest: getLatest,
        getPositions: getPositions
    };

    function getControllers() {
        return IntelilightResource.controllers().$promise;
    }

    function getLatest() {
        return IntelilightResource.latest().$promise;
    }

    function getPositions() {
        return IntelilightResource.position().$promise;
    }
}