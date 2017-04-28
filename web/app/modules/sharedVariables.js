'use strict';

angular.module('Smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
    var mapType = true;
    var initHeatMap = 0;

    return {
        getMapType: getMapType,
        setMapType: setMapType,
        getInitHeatMap: getInitHeatMap,
        setInitHeatMap: setInitHeatMap
    };

    function setMapType() {
        mapType = !mapType;
    }

    function getMapType() {
        return mapType;
    }

    function getInitHeatMap() {
        return initHeatMap;
    }

    function setInitHeatMap() {
        initHeatMap++;
    }
}