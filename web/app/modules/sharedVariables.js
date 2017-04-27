'use strict';

angular.module('Smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
    var mapType = false;

    return {
        getMapType: getMapType,
        setMapType: setMapType
    };

    function setMapType(value) {
        mapType = value;
    }

    function getMapType() {
        return mapType;
    }
}