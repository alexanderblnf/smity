'use strict';

angular.module('Smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
	var mapType = false;
    var initHeatMap = 0;
    var param = '';
    var measureUnits = {
        temperature: '°C',
        pressure: 'Pa',
        humidity: '%',
        co2: 'ppm',
        pm25: 'µg/m3',
        ch2o: 'ppm',
        cpm: 'µSv/h',
        voc: ''
    };

    return {
        getMapType: getMapType,
        setMapType: setMapType,
        getInitHeatMap: getInitHeatMap,
        setInitHeatMap: setInitHeatMap,
	    clearInitHeatMap: clearInitHeatMap,
        getParam: getParam,
        setParam: setParam,
        getMeasureUnits: getMeasureUnits
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

    function getMeasureUnits() {
        return measureUnits;
    }
}