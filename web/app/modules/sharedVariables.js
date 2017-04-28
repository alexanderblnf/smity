'use strict';

angular.module('Smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
    var mapType = true;
    var initHeatMap = 0;
    var param = '';

    return {
        getMapType: getMapType,
        setMapType: setMapType,
        getInitHeatMap: getInitHeatMap,
        setInitHeatMap: setInitHeatMap,
        getParam: getParam,
        setParam: setParam
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

    function getParam() {
        return param;
    }

    function setParam(value) {
        param = value;
    }
}