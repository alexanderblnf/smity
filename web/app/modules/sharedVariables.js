'use strict';

angular.module('Smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
	var mapType = false;
    var initHeatMap = 0;
    var param = '';

    return {
        getMapType: getMapType,
        setMapType: setMapType,
        getInitHeatMap: getInitHeatMap,
        setInitHeatMap: setInitHeatMap,
	    clearInitHeatMap: clearInitHeatMap,
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

	function clearInitHeatMap() {
		initHeatMap = 0;
    }

    function getParam() {
        return param;
    }

    function setParam(value) {
        param = value;
    }
}