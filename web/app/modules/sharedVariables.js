'use strict';

angular.module('Smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
	var mapType = false;
    var initHeatMap = 0;
    var param = '';
    var preferences = [];
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
        getMeasureUnits: getMeasureUnits,
        getPreferences: getPreferences,
        setPreferences: setPreferences
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

    function getPreferences() {
        return preferences;
    }

    function setPreferences(value) {
        preferences = value;
    }
}